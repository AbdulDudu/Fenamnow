import { Attachment, AttachmentProps } from "stream-chat-react";
import { LocationAttachment } from "./location-attachment";
import VoiceMessageAttachemt from "./voice-message-attachment";

export const MessageAttachment: React.FC<AttachmentProps> = props => {
  const { attachments } = props;

  if (attachments[0]?.type === "map" || attachments[0]?.type === "location") {
    return <LocationAttachment mapAttachment={attachments[0]} />;
  }

  if (attachments[0]?.type === "voice-message") {
    return <VoiceMessageAttachemt voiceAttachment={attachments[0]} />;
  }

  return <Attachment {...props} />;
};
