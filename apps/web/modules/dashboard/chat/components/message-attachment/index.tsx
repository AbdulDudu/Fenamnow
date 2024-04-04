import { Attachment, AttachmentProps } from "stream-chat-react";
import { LocationAttachment } from "./location-attachment";

export const MessageAttachment: React.FC<AttachmentProps> = props => {
  const { attachments } = props;

  if (attachments[0]?.type === "map") {
    return <LocationAttachment mapAttachment={attachments[0]} />;
  }

  return (
    <div className="p-4">
      <Attachment {...props} />
    </div>
  );
};
