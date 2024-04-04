"use client";

import { cn } from "@ui/lib/utils";
import { useSession } from "@web/modules/common/shared/providers/session";
import { ClassValue } from "class-variance-authority/types";
import { useState } from "react";
import {
  Channel,
  ChannelHeader,
  MessageList,
  StreamMessage,
  MessageInput as StreamMessageInput,
  Window
} from "stream-chat-react";
import { MessageAttachment } from "../components/message-attachment";
import MessageInput from "../components/message-input";
import { ShareLocationModal } from "../components/share-location-modal";

export default function ChatRoom({ className }: { className?: ClassValue }) {
  const [shareLocation, setShareLocation] = useState(false);
  const locationHandler = (
    message: StreamMessage,
    event: React.BaseSyntheticEvent
  ) => {
    setShareLocation(true);
  };

  const customMessageActions = {
    "Share Location": locationHandler
  };

  return (
    <div className={cn("h-full min-h-full w-2/3", className)}>
      <Channel Attachment={MessageAttachment}>
        <Window>
          <ShareLocationModal
            shareLocation={shareLocation}
            setShareLocation={setShareLocation}
          />
          <ChannelHeader />
          <MessageList customMessageActions={customMessageActions} />
          <StreamMessageInput Input={MessageInput} />
        </Window>
      </Channel>
    </div>
  );
}
