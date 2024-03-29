"use client";

import { cn } from "@ui/lib/utils";
import { useSession } from "@web/modules/common/shared/providers/session";
import { ClassValue } from "class-variance-authority/types";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window
} from "stream-chat-react";

export default function ChatRoom({ className }: { className?: ClassValue }) {
  const { session } = useSession();

  return (
    <div className={cn("h-full w-2/3", className)}>
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
