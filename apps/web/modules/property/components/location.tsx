import { Button } from "@fenamnow/ui/components/ui/button";
import { Label } from "@fenamnow/ui/components/ui/label";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  GoogleMap,
  Libraries,
  MarkerF,
  useLoadScript
} from "@react-google-maps/api";
import { MAP_LIBRARIES } from "@web/lib/utils/constants";
import Link from "next/link";
import { useMemo } from "react";

export default function PropertyLocation({
  latitude,
  longitude,
  city,
  community,
  listing_type
}: {
  latitude?: number | null;
  longitude?: number | null;
  city: string;
  community: string;
  listing_type: string;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES as Libraries
  });

  const mapCenter = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: latitude || 0,
      lng: longitude || 0
    }),
    [latitude, longitude]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: false
    }),
    []
  );

  return (
    <div className="flex h-[400px] w-full flex-col space-y-6">
      <Label>Location</Label>
      <div className="flex-1">
        {isLoaded && (
          <GoogleMap
            options={mapOptions}
            zoom={18}
            center={mapCenter}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
              borderRadius: "8px"
            }}
          >
            {latitude && longitude && (
              <MarkerF
                position={{
                  lat: latitude,
                  lng: longitude
                }}
              />
            )}
          </GoogleMap>
        )}
        <Button asChild variant="link" className="px-0">
          <Link
            href={`/search/${listing_type}?city=${city}&community=${community}`}
          >
            See more listings {community} <ArrowRightIcon className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
