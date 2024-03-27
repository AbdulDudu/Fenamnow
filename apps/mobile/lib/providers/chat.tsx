import React, { useState } from "react";

type ChatContextType = {
  channel: any;
  setChannel: (channel: any) => void;
  thread: any;
  setThread: (thread: any) => void;
  unreadMessages?: number;
};

export const ChatContext = React.createContext({} as ChatContextType);

export const ChatProvider = ({
  children,
  unreadCount
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) => {
  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(unreadCount || 0);
  console.log(unreadCount);
  return (
    <ChatContext.Provider
      value={{ channel, setChannel, thread, setThread, unreadMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatProviderContext = () => React.useContext(ChatContext);
