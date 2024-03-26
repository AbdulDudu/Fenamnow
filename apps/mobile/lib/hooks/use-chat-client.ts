// useChatClient.js

import { useEffect, useState } from "react";
import { getStreamChatClient } from "../helpers/getstream";

export const useChatClient = ({
  user,
  token
}: {
  user: {
    id: string;
    name: string;
  };
  token: string;
}) => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number | null>();
  const [chatClient, setChatClient] = useState<any>();
  useEffect(() => {
    const setupClient = async () => {
      try {
        getStreamChatClient.connectUser(user, token);
        setClientIsReady(true);
        setChatClient(getStreamChatClient);
        setUnreadCount(
          (await getStreamChatClient.getUnreadCount(user.id)).total_unread_count
        );
        // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
        // But in case you need the chat to load from offline storage first then you should render chat components
        // immediately after calling `connectUser()`.
        // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    if (!getStreamChatClient.userID) {
      setupClient();
    }
  }, [user, token]);

  return {
    clientIsReady,
    chatClient
  };
};
