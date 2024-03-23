import { StreamChat } from "stream-chat";

export const chatApiKey = process.env.EXPO_PUBLIC_GETSTREAM_API_KEY as string;
export const chatClient = StreamChat.getInstance(chatApiKey, {});

// NOTE: All values below thi line are for testing purposes. They'll be deleted once this shit is online
export const chatUserId = "salih";
export const chatUserName = "salih";
