import { StreamChat } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-expo";

export const chatApiKey = process.env.EXPO_PUBLIC_GETSTREAM_API_KEY as string;
export const chatClient =
  StreamChat.getInstance<DefaultStreamChatGenerics>(chatApiKey);
