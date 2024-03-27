import { createChatToken } from "@/lib/data/chat";
import { useChatProviderContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ChannelList } from "stream-chat-expo";

export default function ChatListScreen() {
  const { session } = useSession();
  const { setChannel } = useChatProviderContext();
  const router = useRouter();

  if (!session) {
    return <ScreenProtector />;
  }

  const sort: any = {
    last_message_at: -1
  };

  const { data } = useQuery({
    queryKey: [session?.user?.id!],
    queryFn: () => createChatToken(session?.user?.id!)
  });

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
