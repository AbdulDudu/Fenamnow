import { Button } from "@fenamnow/ui/components/ui/button";
import { Checkbox } from "@fenamnow/ui/components/ui/checkbox";
import { Label } from "@fenamnow/ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@fenamnow/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@fenamnow/ui/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@fenamnow/ui/components/ui/sheet";
import { Slider } from "@fenamnow/ui/components/ui/slider";
import { Switch } from "@fenamnow/ui/components/ui/switch";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryClient } from "@tanstack/react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getLocations } from "@web/lib/queries/location";
import {
  getLeaseDurations,
  getPropertyTypes
} from "@web/lib/queries/properties";
import { capitalize } from "lodash";
import { FilterIcon, Minus, Plus, Space } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function SearchFilters({
  newFilters,
  setNewFilters,
  // setFilters,
  applyFilters
}: {
  newFilters: any;
  setNewFilters: any;
  // setFilters: any;
  applyFilters: any;
}) {
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || undefined;
  const community = searchParams.get("community") || undefined;
  const supabase = useSupabaseBrowser();

  const { data: propertyTypes } = useQuery(
    getPropertyTypes({ client: supabase })
  );
  const { data: leaseDurations } = useQuery(
    getLeaseDurations({ client: supabase })
  );

  // const [searchString, setSearchString] = useState("");
  // const [searchRoute, setSearchRoute] = useState("rental");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      if (value == "all") {
        params.delete(name);
      }
      if (name == "listing_type") {
        params.delete("listing_type");
      }
      if (name === "city") {
        params.delete("community");
      }

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="grid h-max w-full grid-cols-3 gap-4">
      <Select
        defaultValue={city || "all"}
        value={city || "all"}
        onValueChange={value => {
          // queryClient.invalidateQueries({
          //   queryKey: ["search"]
          // });
          router.push(`${pathname + "?" + createQueryString("city", value)}`);
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(getLocations).map(key => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={community || "all"}
        value={community || "all"}
        disabled={!city || !getLocations[city as string]}
        onValueChange={value => {
          // queryClient.invalidateQueries({
          //   queryKey: ["search"]
          // })
          router.push(
            `${pathname + "?" + createQueryString("community", value)}`
          );
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select a community" />
        </SelectTrigger>
        <SelectContent>
          {city &&
            getLocations[city as string]?.map((community: string) => (
              <SelectItem key={community} value={community}>
                {community}
              </SelectItem>
            ))}
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>

      {/* More Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button>
            <FilterIcon className="mr-2" />
            More Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>More Filters</SheetTitle>
            <SheetDescription>
              Adjust these to help narrow down your search
            </SheetDescription>
          </SheetHeader>
          <div className="flex size-full flex-col space-y-12 pt-6">
            {/* Listing types */}
            <div className="w-full">
              <Label>Listing types</Label>
              <RadioGroup
                defaultValue={newFilters.listing_type}
                value={newFilters.listing_type}
                onValueChange={value => {
                  setNewFilters({ ...newFilters, listing_type: value });
                }}
                className="flex flex-wrap gap-2"
              >
                <div className="space-x-2">
                  <RadioGroupItem value="rental" />
                  <Label htmlFor="rental" className="capitalize">
                    Rental
                  </Label>
                </div>
                <div className="space-x-2">
                  <RadioGroupItem value="sale" />
                  <Label htmlFor="sale" className="capitalize">
                    Sale
                  </Label>
                </div>
                <div className="space-x-2">
                  <RadioGroupItem value="lease" />
                  <Label htmlFor="lease" className="capitalize">
                    Lease
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* Property types */}
            <div className="w-full space-y-2">
              <Label>Property types</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes?.map(type => (
                  <div className="space-x-2" key={type.name}>
                    <Checkbox
                      key={type.id}
                      checked={newFilters.property_types.includes(type.name)}
                      onCheckedChange={checked => {
                        if (checked) {
                          setNewFilters({
                            ...newFilters,
                            property_types: [
                              ...newFilters.property_types,
                              type.name
                            ]
                          });
                        } else {
                          setNewFilters({
                            ...newFilters,
                            property_types: newFilters.property_types.filter(
                              (item: string) => item !== type.name
                            )
                          });
                        }
                      }}
                    />
                    <Label className="capitalize">{type.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Lease duration */}
            <div className="w-full">
              <Label>Lease duration</Label>
              <div className="flex flex-wrap gap-2">
                {leaseDurations?.map(duration => (
                  <div className="space-x-2" key={duration.name}>
                    <Checkbox
                      key={duration.name}
                      checked={newFilters.lease_durations.includes(
                        duration.name
                      )}
                      onCheckedChange={checked => {
                        if (checked) {
                          setNewFilters({
                            ...newFilters,
                            lease_durations: [
                              ...newFilters.lease_durations,
                              duration.name
                            ]
                          });
                        } else {
                          setNewFilters({
                            ...newFilters,
                            lease_durations: newFilters.lease_durations.filter(
                              (item: string) => item !== duration.name
                            )
                          });
                        }
                      }}
                    />
                    <Label className="capitalize">{duration.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Bedrooms and Bathrooms */}
            <div className="flex w-full justify-between">
              {/* Bedrooms */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      if (newFilters.bedrooms > 0) {
                        setNewFilters({
                          ...newFilters,
                          bedrooms: newFilters.bedrooms - 1
                        });
                      }
                    }}
                  >
                    <Minus />
                  </Button>
                  <p>{newFilters?.bedrooms?.toLocaleString() || 0}</p>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setNewFilters({
                        ...newFilters,
                        bedrooms:
                          newFilters.bedrooms >= 0 ? newFilters.bedrooms + 1 : 1
                      });
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              {/* Bathrooms */}
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      if (newFilters.bathrooms > 0) {
                        setNewFilters({
                          ...newFilters,
                          bathrooms: newFilters.bathrooms - 1
                        });
                      }
                    }}
                  >
                    <Minus />
                  </Button>
                  <p>{newFilters?.bathrooms?.toLocaleString() || 0}</p>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setNewFilters({
                        ...newFilters,
                        bathrooms:
                          newFilters.bathrooms >= 0
                            ? newFilters.bathrooms + 1
                            : 1
                      });
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            </div>
            {/* Price range */}
            <div className="my-6 w-full space-y-2">
              <Label>Price range</Label>
              <Slider
                minStepsBetweenThumbs={1}
                className="w-full"
                max={1000000}
                min={1000}
                step={1000}
                value={newFilters.price_range}
                onValueChange={values => {
                  setNewFilters({
                    ...newFilters,
                    price_range: values
                  });
                }}
                formatLabel={value => `$ ${value.toLocaleString()}`}
              />
            </div>
            {/* Furnished status and Negotiable */}
            <div className="flex w-full items-center space-x-4">
              <div className="flex flex-col space-y-2">
                <Label>Furnished?</Label>
                <Switch
                  checked={newFilters.furnished}
                  onCheckedChange={checked =>
                    setNewFilters({ ...newFilters, furnished: checked })
                  }
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Negotiable?</Label>
                <Switch
                  checked={newFilters.negotiable}
                  onCheckedChange={checked =>
                    setNewFilters({ ...newFilters, negotiable: checked })
                  }
                />
              </div>
            </div>
            {/* Reset and Apply filters actions */}
            <div className="flex w-full justify-between">
              <Button variant="outline">Close</Button>
              <Button
                onClick={() => {
                  console.log(newFilters);
                  applyFilters();
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
