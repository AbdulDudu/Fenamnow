import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { chatClient } from "../helpers/chat";

export const useChatClient = ({
  session,
  token
}: {
  session: Session;
  token: string;
}) => {
  const [clientIsReady, setClientIsReady] = useState(false);
  useEffect(() => {
    const setupClient = async () => {
      try {
        chatClient.connectUser(
          {
            id: session?.user.id,
            name: session?.user.user_metadata.full_name
          },
          token
        );
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    if (!chatClient.userID) {
      setupClient();
    }
  }, [token]);

  return {
    clientIsReady
  };
};
