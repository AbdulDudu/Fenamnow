import { StreamChatGenerics } from "@fenamnow/types/chat";
import React, { useMemo, useState } from "react";
import type { Channel } from "stream-chat";

type ChatContextType = {
  channel: Channel<StreamChatGenerics> | undefined;
  setChannel: (channel: Channel<StreamChatGenerics> | undefined) => void;
  thread: any;
  setThread: (thread: any) => void;
  unreadMessages?: any;
};

export const ChatContext = React.createContext({} as ChatContextType);

export const ChatProvider = ({
  children,
  unreadCount
}: {
  children: React.ReactNode;
  unreadCount: any;
}) => {
  const [channel, setChannel] = useState<
    Channel<StreamChatGenerics> | undefined
  >();
  const [thread, setThread] = useState(null);
  const unreadMessages = useMemo(() => unreadCount, [unreadCount]);

  return (
    <ChatContext.Provider
      value={{
        channel,
        setChannel,
        thread,
        setThread,
        unreadMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatProviderContext = () => React.useContext(ChatContext);
