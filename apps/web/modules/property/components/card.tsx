import { Database } from "@fenamnow/types/database";
import { Badge } from "@fenamnow/ui/components/ui/badge";
import { Button } from "@fenamnow/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@fenamnow/ui/components/ui/dropdown-menu";
import { Separator } from "@fenamnow/ui/components/ui/separator";
import { EyeOpenIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { truncate } from "lodash";
import { Bath, Bed, MoreVertical, Scaling } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaExchangeAlt } from "react-icons/fa";
import { PublicImage } from "./images";

export type PropertyCardProps =
  Database["public"]["Tables"]["properties"]["Row"];

export const leaseDurations: Record<string, string> = {
  month: "month",
  "6 months": "6 months",
  year: "year",
  "2 years": "2 years",
  "more than 2 years": "2 years +"
};
export default function PropertyCard({
  id,
  images,
  price,
  lease_duration,
  city,
  community,
  address,
  bathrooms,
  bedrooms,
  property_size,
  property_type,
  isDashboard
}: Partial<PropertyCardProps> & {
  isDashboard?: boolean;
}) {
  return (
    <div className="bg-accent dark:bg-accent/40 hover:dark:bg-accent hover:bg-accent/30 h-[340px] w-full rounded-lg transition-colors ease-in-out">
      <Link
        href={`/property/${id}`}
        className={isDashboard ? "pointer-events-none" : ""}
        aria-disabled={isDashboard}
        tabIndex={isDashboard ? -1 : undefined}
      >
        <div className="relative h-1/2 w-full">
          <PublicImage
            priority
            className="rounded-t-lg object-cover"
            // @ts-ignore
            path={(images?.[0]?.uri as string) ?? images?.[0]}
            bucket="properties"
            fill
            alt={address || ""}
          />
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between gap-y-1 px-4 py-1">
        {/* Price, lease duration and menu button */}
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-bold">
            ${price?.toLocaleString("en-GB")}
            {lease_duration && (
              <span className="ml-1 text-sm font-semibold opacity-75">
                /{leaseDurations[lease_duration]}
              </span>
            )}
          </p>
          {isDashboard && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-max justify-end p-0"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/property/${id}`}>
                    <EyeOpenIcon className="mr-2" />
                    View Property
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/properties/edit/${id}`}>
                    <Pencil2Icon className="mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaExchangeAlt className="mr-2" />
                  Set to unavailable
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <TrashIcon className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-lg font-bold">{city}</p>

        <div>
          <p className="truncate text-sm">
            {community}, {truncate(address, { length: 12 })}
          </p>
        </div>
        <Separator className="bg-foreground/30 my-1" />
        <div className="flex w-full items-center gap-[20%] text-xs">
          <div className="flex items-center">
            <Bed className="size-3" />
            <p>{bedrooms}</p>
          </div>
          <div className="flex items-center">
            <Bath className="size-3" />
            <p>{bathrooms}</p>
          </div>
          <div className="flex items-center">
            <Scaling className="size-3" />
            <p>
              {property_size?.toLocaleString("en-GB")}m<sup>2</sup>
            </p>
          </div>
        </div>
        <Badge className="my-1 max-w-max self-end capitalize">
          {property_type}
        </Badge>
      </div>
    </div>
  );
}
