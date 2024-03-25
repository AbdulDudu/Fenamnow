import React, { useState } from "react";
import { DeepPartial, DefaultStreamChatGenerics } from "stream-chat-expo";

type ChatContextType = {
  channel: any;
  setChannel: (channel: any) => void;
  thread: any;
  setThread: (thread: any) => void;
  unreadCount?: number;
};

export const ChatContext = React.createContext({} as ChatContextType);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <ChatContext.Provider
      value={{ channel, setChannel, thread, setThread, unreadCount }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => React.useContext(ChatContext);
