import { Button } from "@fenamnow/ui/components/ui/button";
import { Play } from "lucide-react";
import React from "react";

export default function VoiceMessageAttachemt({ voiceAttachment }: any) {
  console.log(voiceAttachment);

  return (
    <div className="h-20">
      <div className="flex h-full w-full items-center rounded-3xl p-4">
        {/* Play Back */}
        <Button size="icon" variant="ghost">
          <Play />
        </Button>
        {/* Sound waves */}
        <div className="h-full w-[250px] border border-red-500">
          {/* <audio crossOrigin=""></audio> */}
        </div>
      </div>
    </div>
  );
}
