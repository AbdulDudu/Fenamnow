import { Button } from "@fenamnow/ui/components/ui/button";
import { Textarea } from "@fenamnow/ui/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";
import {
  AttachmentPreviewList as DefaultAttachmentPreviewList,
  LinkPreviewList as DefaultLinkPreviewList,
  useComponentContext,
  useMessageInputContext
} from "stream-chat-react";
import AttachmentButton from "./attachment-button";

export default function MessageInput() {
  const { text, handleChange, handleSubmit, linkPreviews } =
    useMessageInputContext();
  const {
    AttachmentPreviewList = DefaultAttachmentPreviewList,
    LinkPreviewList = DefaultLinkPreviewList
  } = useComponentContext();

  return (
    <div className="flex min-h-max w-full flex-col items-center border p-4">
      <AttachmentPreviewList />
      <LinkPreviewList linkPreviews={Array.from(linkPreviews.values())} />

      <div className="flex h-20 w-full items-center justify-between gap-x-4">
        <AttachmentButton />
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder="Send Message"
          className="min-h-10 resize-none text-lg placeholder:text-lg"
        />
        <Button variant="link" size="icon" onClick={handleSubmit}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
