import { StreamChatGenerics } from "@fenamnow/types/chat";
import { StreamChat } from "stream-chat";

export const chatApiKey = process.env.EXPO_PUBLIC_GETSTREAM_API_KEY as string;
export const getStreamChatClient = StreamChat.getInstance<StreamChatGenerics>(
  chatApiKey,
  {
    timeout: 10000
  }
);
