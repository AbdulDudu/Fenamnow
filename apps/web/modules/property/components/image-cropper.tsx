import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@fenamnow/ui/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

export function ImageCropper({
  src,
  setShowCropper,
  showCropper
}: {
  src: string;
  setShowCropper: any;
  showCropper: any;
}) {
  const [crop, setCrop] = useState<Crop>();
  return (
    <Dialog
      open={showCropper}
      onOpenChange={() => setShowCropper(!showCropper)}
    >
      <DialogContent className="h-[600px]">
        <DialogHeader>
          <DialogTitle>Crop the image to your liking</DialogTitle>
          {/* <DialogClose asChild></DialogClose> */}
        </DialogHeader>
        <div className="h-[450px] w-full">
          <ReactCrop
            className="size-full"
            style={{
              //   height: "100%",
              borderColor: "red",
              borderWidth: "1px"
            }}
            // className="h-[450px]"
            crop={crop}
            onChange={c => setCrop(c)}
          >
            {/* <img className="border border-red-500" src={src} alt="" /> */}
          </ReactCrop>
        </div>
        <DialogFooter>
          <DialogClose asChild onClick={() => setShowCropper(false)}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
