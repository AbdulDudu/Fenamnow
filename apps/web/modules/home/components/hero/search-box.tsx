"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@fenamnow/ui/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@fenamnow/ui/components/ui/toggle-group";
import { Label } from "@radix-ui/react-label";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getLocations } from "@web/lib/queries/location";
import { getPropertyTypes } from "@web/lib/queries/properties";
import { capitalize } from "lodash";
import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

export default function SearchBox() {
  const supabase = useSupabaseBrowser();

  const [searchString, setSearchString] = useState("");
  const [searchRoute, setSearchRoute] = useState("rental");
  const { data: propertyTypes } = useQuery(
    getPropertyTypes({ client: supabase })
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchString);
      params.set(name, value);
      if (value == "all") {
        params.delete(name);
      }
      if (name === "city") {
        params.delete("community");
      }
      return params.toString();
    },
    [searchString]
  );

  const city = new URLSearchParams(searchString).get("city");

  return (
    <div className="flex w-full flex-col items-start md:w-1/2">
      <ToggleGroup
        type="single"
        value={searchRoute}
        onValueChange={(value: string) => {
          setSearchRoute(value);
        }}
      >
        <ToggleGroupItem value="rental" aria-label="Toggle Rent">
          <p>Rent</p>
        </ToggleGroupItem>
        <ToggleGroupItem value="sale" aria-label="Toggle Buy">
          <p>Buy</p>
        </ToggleGroupItem>
        <ToggleGroupItem value="lease" aria-label="Toggle Lease">
          <p>Lease</p>
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="bg-accent flex h-32 w-full flex-col items-end justify-center space-y-2 rounded-xl p-4">
        <div className="flex w-full items-center space-x-4">
          {/* Property type */}
          <div className="w-1/3">
            <Label>Property type</Label>
            <Select
              defaultValue="all"
              onValueChange={value => {
                setSearchString(createQueryString("property_type", value));
              }}
            >
              <SelectTrigger className="border-foreground w-full">
                <SelectValue placeholder="Select a Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {propertyTypes?.map(propertyType => (
                    <SelectItem
                      key={propertyType.id}
                      value={propertyType.name}
                      className="capitalize"
                    >
                      {capitalize(propertyType.name)}
                    </SelectItem>
                  ))}
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="w-1/3">
            <Label>City</Label>
            <Select
              defaultValue="all"
              onValueChange={value => {
                setSearchString(createQueryString("city", value));
              }}
            >
              <SelectTrigger className="border-foreground w-full">
                <SelectValue placeholder="Select a City" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(getLocations)?.map(city => (
                    <SelectItem key={city} value={city} className="capitalize">
                      {capitalize(city)}
                    </SelectItem>
                  ))}
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Community */}
          <div className="w-1/3">
            <Label>Community</Label>
            <Select
              defaultValue="all"
              onValueChange={value => {
                setSearchString(createQueryString("community", value));
              }}
            >
              <SelectTrigger className="border-foreground w-full">
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {(city !== "" || city != null) &&
                    getLocations[city || ""]?.map(community => (
                      <SelectItem
                        key={community}
                        value={community}
                        className="capitalize"
                      >
                        {capitalize(community)}
                      </SelectItem>
                    ))}
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button asChild>
          <Link href={`/search/${searchRoute}?${searchString}`}>
            <Search className="mr-2" />
            Search
          </Link>
        </Button>
      </div>
    </div>
  );
}
