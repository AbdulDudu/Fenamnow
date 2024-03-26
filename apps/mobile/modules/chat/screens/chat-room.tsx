import { useChatContext } from "@/lib/providers/chat";
import { Screen } from "@/modules/common/ui/screen";
import { useToken } from "@gluestack-style/react";
import { Stack } from "expo-router";
import React from "react";
import {
  Channel,
  MessageInput,
  MessageList,
  Thread,
  useChannelPreviewDisplayName
} from "stream-chat-expo";

export default function ChatRoomScreen() {
  const { channel, setChannel } = useChatContext();
  const title = useChannelPreviewDisplayName(channel);

  const primaryColor = useToken("colors", "primary500");

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
