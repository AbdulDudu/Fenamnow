"use client";

import { useQuery } from "@tanstack/react-query";
import { getStreamChatClient } from "@web/lib/helpers/chat";
import { createChatToken } from "@web/lib/queries/chats";
import { useTheme } from "next-themes";
import { Chat } from "stream-chat-react";
import { useSession } from "./session";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  //   const { session } = useSession();
  const { theme } = useTheme();

  //   const { data } = useQuery({
  //     queryKey: [session],
  //     queryFn: async () =>
  //       await createChatToken(session.user.id).then(
  //         async res =>
  //           await getStreamChatClient.connectUser(
  //             { id: session.user.id },
  //             res.token
  //           )
  //       ),
  //     enabled: !!session
  //   });

  return (
    <Chat
      client={getStreamChatClient}
      theme={
        theme == "light" ? "str-chat__theme-light" : "str-chat__theme-dark"
      }
    >
      {children}
    </Chat>
  );
};
