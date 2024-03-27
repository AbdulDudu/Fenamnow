import { getStreamChatClient } from "@/lib/helpers/getstream";
import { useChatProviderContext } from "@/lib/providers/chat";
import { Screen } from "@/modules/common/ui/screen";
import { useToken } from "@gluestack-style/react";
import { Text } from "@gluestack-ui/themed";
import { Stack, useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  useChannelPreviewDisplayName
} from "stream-chat-expo";

export default function ChatRoomScreen() {
  const { channel, setChannel } = useChatProviderContext();
  const title = useChannelPreviewDisplayName(channel);

  const { cid } = useGlobalSearchParams();
  const primaryColor = useToken("colors", "primary500");

  const isOneOnOneConversation =
    channel &&
    Object.values(channel.state.members).length === 2 &&
    channel.id?.indexOf("!members-") === 0;

  useEffect(() => {
    const initChannel = async () => {
      if (channel) {
        return;
      }
      const newChannel = getStreamChatClient?.channel(
        "messaging",
        cid as string
      );
      if (!newChannel?.initialized) {
        await newChannel?.watch();
      }
      setChannel(newChannel);
    };

    initChannel();
  }, [cid, channel]);

  if (cid && !channel) {
    return (
      <Screen>
        <Text>{cid}</Text>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen
        listeners={{
          beforeRemove: () => {
            setChannel(null);
          }
        }}
        options={{
          title: title || "",
          headerBackButtonMenuEnabled: true,
          headerBackTitleVisible: false
        }}
      />
      <Screen px="$0" edges={[]}>
        <Channel channel={channel!}>
          <MessageList
            initialScrollToFirstUnreadMessage
            myMessageTheme={{
              messageSimple: {
                content: {
                  containerInner: {
                    backgroundColor: primaryColor,
                    borderColor: "transparent"
                  }
                }
              }
            }}
          />
          <MessageInput />
          <Thread />
        </Channel>
      </Screen>
    </>
  );
}
