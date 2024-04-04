import { prepareStaticMapUrl } from "@web/lib/utils/prepare-map-url";
import { Loader2 } from "lucide-react";

type ExtendedAttachment = {
  latitude?: number;
  longitude?: number;
};

type MapAttachmentProps<ExtendedAttachment> = {
  mapAttachment: any;
};

export const LocationAttachment: React.FC<
  MapAttachmentProps<ExtendedAttachment>
> = props => {
  const { mapAttachment } = props;

  const { latitude, longitude } = mapAttachment;

  if (!latitude || !longitude) {
    return <Loader2 className="animate-spin" size={30} />;
  }

  const center = {
    lat: latitude,
    lng: longitude
  };

  const mapImageUrl = prepareStaticMapUrl(center.lat, center.lng);
  return (
    <div className="h-96 items-center justify-center rounded-3xl p-4">
      <img
        className="size-full rounded-md object-cover"
        src={decodeURI(mapImageUrl)}
        alt=""
      />
    </div>
  );
};
