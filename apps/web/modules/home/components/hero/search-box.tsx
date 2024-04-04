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
import { motion } from "framer-motion";
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
    <motion.div
      className="z-10 flex w-full flex-col items-start md:w-1/2"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0, dur: 400 }}
      transition={{ delay: 1 }}
    >
      <ToggleGroup
        type="single"
        value={searchRoute}
        onValueChange={(value: string) => {
          setSearchRoute(value);
        }}
        className="bg-accent rounded-t-xl rounded-tl-xl p-2"
      >
        <ToggleGroupItem
          value="rental"
          className="data-[state=on]:bg-primary data-[state=off]:bg-accent data-[state=off]:text-primary data-[state=on]:text-white"
          aria-label="Toggle Rent"
        >
          Rent
        </ToggleGroupItem>
        <ToggleGroupItem
          value="sale"
          className="data-[state=on]:bg-primary data-[state=off]:bg-accent data-[state=off]:text-primary data-[state=on]:text-white"
          aria-label="Toggle Buy"
        >
          Buy
        </ToggleGroupItem>
        <ToggleGroupItem
          value="lease"
          className="data-[state=on]:bg-primary data-[state=off]:bg-accent data-[state=off]:text-primary data-[state=on]:text-white"
          aria-label="Toggle Lease"
        >
          Lease
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="bg-accent flex h-40 w-full flex-col items-end justify-between space-y-2 rounded-b-xl rounded-r-xl p-4">
        <div className="flex w-full items-center space-x-4">
          {/* Property type */}
          <div className="w-1/3">
            <Label className="font-semibold">Property type</Label>
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
            <Label className="font-semibold">City</Label>
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
            <Label className="font-semibold">Community</Label>
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
          <Link href={`/search/${searchRoute}?page=1&${searchString}`}>
            <Search className="mr-2" />
            Search
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
