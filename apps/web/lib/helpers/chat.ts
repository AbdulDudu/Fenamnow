import { StreamChat } from "stream-chat";

export const chatApiKey = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY as string;
export const chatApiSecret = process.env.GETSTREAM_API_SECRET as string;
export const getStreamChatClient = StreamChat.getInstance(chatApiKey);
