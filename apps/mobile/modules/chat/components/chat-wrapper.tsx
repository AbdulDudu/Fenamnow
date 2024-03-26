import { getStreamChatClient } from "@/lib/helpers/getstream";
import { HEIGHT } from "@/lib/utils/constants";
import { useColorMode, useToken } from "@gluestack-style/react";
import React from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import type { DeepPartial, Theme } from "stream-chat-expo";

export const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
  const colorMode = useColorMode();

  const listLightBackgroundColor = useToken("colors", "secondary200");
  const listMessengerLightBackgroundColor = useToken("colors", "secondary300");

  const listDarkBackgroundColor = useToken("colors", "black");
  const listMessengerDarkBackgroundColor = useToken("colors", "secondary800");

  const chatTheme: DeepPartial<Theme> = {
    channelListMessenger: {
      flatList: {
        backgroundColor:
          colorMode == "light"
            ? listMessengerLightBackgroundColor
            : listMessengerDarkBackgroundColor
      },
      flatListContent: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      }
    },
    channelPreview: {
      container: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor
      },
      title: {
        color: colorMode == "light" ? "black" : "white"
      }
    },
    channelListSkeleton: {
      container: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      },
      // @ts-ignore
      maskFillColor: colorMode == "light" ? "white" : "black",
      background: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor
      }
    },
    messageList: {
      container: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      }
    },
    messageInput: {
      container: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor,
        paddingBottom: HEIGHT * 0.03
      },
      inputBoxContainer: {
        borderColor:
          colorMode == "light"
            ? listMessengerDarkBackgroundColor
            : listMessengerLightBackgroundColor
      },
      inputBox: {
        color: colorMode == "light" ? "black" : "white"
      }
    }
  };

  return (
    <OverlayProvider value={{ style: chatTheme }}>
      {/* @ts-ignore */}
      <Chat client={getStreamChatClient}>{children}</Chat>
    </OverlayProvider>
  );
};
