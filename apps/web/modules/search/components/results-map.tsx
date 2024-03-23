import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { cn } from "@ui/lib/utils";
import { PublicImage } from "@web/modules/property/components/images";
import Link from "next/link";
import { useMemo } from "react";

export default function ResultsMap({
  properties,
  isLoaded,
  mapCenter,
  className
}: {
  properties: any;
  isLoaded: boolean;
  mapCenter: google.maps.LatLngLiteral;
  className?: string;
}) {
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true
    }),
    []
  );

  return (
    <div className={cn("h-full w-1/2", className)}>
      {isLoaded && (
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{
            width: "100%",
            height: "100%"
          }}
        >
          {properties?.map(
            (property: {
              id: number;
              latitude: number;
              price: number;
              lease_duration: string;
              longitude: number;
              address: string;
              images: any[];
            }) =>
              property.latitude &&
              property.longitude && (
                <Marker
                  icon={{
                    url: "/icons/map-pin.svg",
                    anchor: new google.maps.Point(-65, -200),
                    scaledSize: new google.maps.Size(50, 50)
                  }}
                  key={`marker-${property.latitude}-${property.longitude}-marker`}
                  position={{
                    lat: property.latitude,
                    lng: property.longitude
                  }}
                >
                  <OverlayView
                    key={`marker-${property.latitude}-${property.longitude}`}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    position={{
                      lat: property.latitude,
                      lng: property.longitude
                    }}
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/property/${property.id}`}
                    >
                      <div className="bg-background hover:bg-accent flex h-40 w-max min-w-24 flex-col space-y-4 rounded-xl p-2 transition-colors ease-in-out md:h-48 md:min-w-44">
                        <div className="relative h-[60%] w-full rounded-sm">
                          <PublicImage
                            priority
                            className="rounded-t-lg object-cover"
                            // @ts-ignore
                            path={
                              (property.images?.[0]?.uri as string) ||
                              property.images?.[0]
                            }
                            bucket="properties"
                            fill
                            alt={property.address || ""}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold leading-tight">
                            ${property.price.toLocaleString()}
                            <span className="text-ellipsis text-sm font-normal opacity-60">
                              {property.lease_duration &&
                                `/${property.lease_duration}`}
                            </span>
                          </p>
                          <p className="text-xs">{property.address}</p>
                        </div>
                      </div>
                    </Link>
                  </OverlayView>
                </Marker>
              )
          )}
        </GoogleMap>
      )}
    </div>
  );
}
