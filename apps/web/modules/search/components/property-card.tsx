import {
  leaseDurations,
  PropertyCardProps
} from "@web/modules/property/components/card";
import { PublicImage } from "@web/modules/property/components/images";
import Image from "next/image";
import Link from "next/link";

export default function SearchPropertyCard({
  id,
  images,
  city,
  community,
  address,
  price,
  lease_duration
}: PropertyCardProps) {
  return (
    <Link
      href={`/property/${id}`}
      className="bg-accent/30 hover:bg-accent flex h-60 w-full flex-col rounded-lg transition-colors ease-in-out"
    >
      <div className="relative h-1/2 w-full rounded-t-lg">
        {images[0] !== null && images !== undefined && (
          <PublicImage
            priority
            className="rounded-t-lg object-cover"
            // @ts-ignore
            path={(images?.[0]?.uri as string) ?? images?.[0]}
            bucket="properties"
            fill
            alt={address || ""}
          />
        )}
      </div>
      <div className="flex w-full flex-col justify-between gap-y-1 p-1">
        {/* Price and lease duration */}
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-bold">
            ${price?.toLocaleString("en-GB")}
            {lease_duration && (
              <span className="ml-1 text-sm font-semibold opacity-75">
                /{leaseDurations[lease_duration]}
              </span>
            )}
          </p>
        </div>
        {/* City */}
        <p className="font-bold">{city}</p>
        {/* community and Address */}
        <p className="text-xs">
          {community}, {address}
        </p>
      </div>
    </Link>
  );
}
