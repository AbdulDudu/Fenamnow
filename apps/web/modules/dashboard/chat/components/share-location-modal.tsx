import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@fenamnow/ui/components/ui/dialog";
import { useEffect, useState } from "react";
import { MessageToSend, useChannelActionContext } from "stream-chat-react";

type ShareLocationModalProps = {
  setShareLocation: React.Dispatch<React.SetStateAction<boolean>>;
  shareLocation: boolean;
};

export const ShareLocationModal: React.FC<ShareLocationModalProps> = props => {
  const { setShareLocation, shareLocation } = props;
  const { sendMessage } = useChannelActionContext();

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const handleYes = async () => {
    const messageToSend: MessageToSend = {
      attachments: [{ type: "map", latitude, longitude }]
    };
    setShareLocation(false);

    try {
      await sendMessage(messageToSend);
    } catch (err) {
      console.log(err);
    }

    setShareLocation(false);
  };

  const handleNo = () => setShareLocation(false);

  return (
    <Dialog open={shareLocation}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Do you want to share your location in this conversation?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild onClick={handleNo}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={!latitude || !longitude}
            onClick={handleYes}
            type="submit"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
