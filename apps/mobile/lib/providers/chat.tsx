import React, { useState } from "react";
import { DeepPartial, DefaultStreamChatGenerics } from "stream-chat-expo";

type ChatContextType = {
  channel: any;
  setChannel: (channel: any) => void;
  thread: any;
  setThread: (thread: any) => void;
};

export const ChatContext = React.createContext({} as ChatContextType);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);

  return (
    <ChatContext.Provider value={{ channel, setChannel, thread, setThread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => React.useContext(ChatContext);
