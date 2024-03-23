import { Button } from "@fenamnow/ui/components/ui/button";
import { Card, CardContent } from "@fenamnow/ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@fenamnow/ui/components/ui/collapsible";
import { Label } from "@fenamnow/ui/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@fenamnow/ui/components/ui/table";
import { intlFormatDistance } from "date-fns";
import { words } from "lodash";
import { Armchair, BathIcon, Bed, Info, Scaling } from "lucide-react";
import React from "react";
import { PropertyCardProps } from "./card";
import PropertyLocation from "./location";

export default function PropertyDescription({
  furnished,
  status,
  bathrooms,
  bedrooms,
  description,
  community,
  property_size,
  listing_type,
  city,
  created_at,
  deposit,
  date_available,
  amenities,
  latitude,
  longitude
}: Partial<PropertyCardProps>) {
  // slice the first 40 words of the sample string
  const numOfWords = words(description).length;
  const desc = words(description).slice(0, 40).join(" ");

  const features: { title: string; value: string }[] = [
    {
      title: "Listed on",
      value: created_at
        ? intlFormatDistance(new Date(created_at as string), new Date(), {})
        : "N/A"
    },
    {
      title: "Deposit",
      value: deposit ? `$ ${deposit?.toLocaleString()}` : "N/A"
    },
    {
      title: "Available since",
      value: date_available
        ? intlFormatDistance(new Date(date_available as string), new Date(), {})
        : "N/A"
    },
    {
      title: "Amenities",
      value: amenities?.join(", ") ?? "N/A"
    }
  ];

  return (
    <div className="flex min-h-screen flex-1 flex-col space-y-4">
      {/* Specs */}
      <div className="space-y-4">
        <Label>Specfications</Label>
        <Card className="bg-accent min-h-max w-full">
          <CardContent className="p-4">
            <div className="grid w-full grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              <div className="flex items-center space-x-3">
                <Bed className="size-6" />
                <p>
                  {bedrooms! > 0 && bedrooms! == 1
                    ? `${bedrooms} Bedroom`
                    : bedrooms! > 1
                      ? `${bedrooms} Bedrooms`
                      : "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <BathIcon className="size-6" />
                <p>
                  {bathrooms! > 0 && bathrooms! == 1
                    ? `${bathrooms} Bathroom`
                    : bathrooms! > 1
                      ? `${bathrooms} Bathrooms`
                      : "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Info className="size-6" />
                <p className="capitalize">{status}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Armchair className="size-6" />
                <p>{furnished ? "Furnished" : "Not furnished"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Scaling className="size-6" />
                <p>
                  {property_size && property_size > 0
                    ? `${property_size.toLocaleString()}m\u00B2`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property description */}
      <div className="space-y-4">
        <Label>Description</Label>
        <Collapsible>
          <p>
            {desc}{" "}
            {numOfWords > 40 && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="link"
                  className="text-primary max-h-max px-0 text-base font-semibold hover:no-underline data-[state=open]:hidden"
                >
                  Read more
                </Button>
              </CollapsibleTrigger>
            )}
          </p>
          <CollapsibleContent>
            {words(description).slice(41, undefined).join(" ")}
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              variant="link"
              className="text-primary max-h-max px-0 text-base font-semibold hover:no-underline data-[state=closed]:hidden"
            >
              Read Less
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Label>Features</Label>
        <Card>
          <CardContent className="p-4">
            <Table className="w-full">
              <TableBody className="w-full">
                {features.map(feature => (
                  <TableRow key={feature.title} className="w-full">
                    <TableCell className="font-bold">{feature.title}</TableCell>
                    <TableCell className="font-medium">
                      {feature.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <PropertyLocation
        latitude={latitude}
        longitude={longitude}
        community={community as string}
        listing_type={listing_type as string}
        city={city as string}
      />
    </div>
  );
}
