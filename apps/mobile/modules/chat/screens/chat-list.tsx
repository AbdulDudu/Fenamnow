import { useChatContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import { useRouter } from "expo-router";
import React from "react";
import { ChannelList } from "stream-chat-expo";

export default function ChatListScreen() {
  const { session } = useSession();
  const { setChannel } = useChatContext();
  const router = useRouter();

  if (!session) {
    return <ScreenProtector />;
  }

  const sort: any = {
    last_message_at: -1
  };

  return (
    <Screen px="$0" edges={[]}>
      <ChannelList
        onSelect={channel => {
          setChannel(channel);
          router.navigate(`/chat/${channel.cid}`);
        }}
        filters={{
          members: {
            $in: [session?.user?.id!]
          }
        }}
        numberOfSkeletons={12}
        sort={sort}
      />
    </Screen>
  );
}
