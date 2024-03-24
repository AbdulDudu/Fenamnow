import { createChatToken } from "@/lib/data/chat";
import { useChatClient } from "@/lib/hooks/use-chat-client";
import { useChatContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import { Button, ButtonText, Spinner, Text } from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ChannelList, useChannelPreviewDisplayName } from "stream-chat-expo";

export default function ChatListScreen() {
  const { session } = useSession();
  const { setChannel } = useChatContext();
  const router = useRouter();

  if (!session) {
    return <ScreenProtector />;
  }

  const { data } = useQuery({
    queryKey: ["createChatToken", session?.user.id],
    queryFn: () => createChatToken(session?.user.id!),
    enabled: !!session
  });

  const { clientIsReady } = useChatClient({
    session: session!,
    token: data?.token
  });

  const sort: any = {
    last_message_at: -1
  };

  if (!clientIsReady) {
    return (
      <Screen
        edges={["bottom"]}
        justifyContent="center"
        px="$0"
        gap="$4"
        alignItems="center"
      >
        <Spinner size="large" />
      </Screen>
    );
  }

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
