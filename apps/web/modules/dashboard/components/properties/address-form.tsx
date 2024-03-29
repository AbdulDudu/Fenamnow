import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@fenamnow/ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@fenamnow/ui/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@fenamnow/ui/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { Input } from "@fenamnow/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@fenamnow/ui/components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronDownIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  GoogleMap,
  Libraries,
  MarkerF,
  useLoadScript
} from "@react-google-maps/api";
import { getLocations } from "@web/lib/queries/location";
import { propertyInsertFormSchema } from "@web/lib/schemas/property";
import { MAP_LIBRARIES } from "@web/lib/utils/constants";
import { LocateIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { PlacesAutocomplete } from "./places-autocomple";

export default function AddressForm({
  form,
  openForm,
  setOpenForm
}: {
  form: UseFormReturn<z.infer<typeof propertyInsertFormSchema>>;
  openForm: number;
  setOpenForm: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [locationAccess, setLocationAccess] = useState<PermissionState>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral>();
  const [address, setAddress] = useState<string>("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES as Libraries
  });

  const mapCenter = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: form.watch("latitude") || location?.lat || 0,
      lng: form.watch("longitude") || location?.lng || 0
    }),
    [form, location?.lat, location?.lng]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false
    }),
    []
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then(result => {
        if (result.state === "granted") {
          setLocationAccess(result.state);
          navigator.geolocation.getCurrentPosition(position => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          });
        }
        if (result.state === "denied") {
          setLocationAccess(result.state);
        }
        if (result.state === "prompt") {
          setLocationAccess(result.state);
        }
      });
    }
  }, []);
  return (
    <Card className="max-w-[640px]">
      <CardHeader>
        <CardTitle>Address Form</CardTitle>
        <CardDescription>
          Details about the property&apos;s location
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        {/* Address input */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-end justify-between">
                Address
                {locationAccess === "denied" && (
                  <p className="text-primary h-max p-0">
                    Location access denied
                  </p>
                )}
              </FormLabel>
              <div className="flex items-center justify-between space-x-6">
                <FormControl>
                  <Input placeholder="Enter property address" {...field} />
                </FormControl>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      {!form.watch("map_address") ? (
                        <Button
                          disabled={!isLoaded || locationAccess !== "granted"}
                          type="button"
                          variant="outline"
                        >
                          <LocateIcon className="mr-2" /> Add Location on map
                        </Button>
                      ) : (
                        <Button
                          disabled={!isLoaded || locationAccess !== "granted"}
                          type="button"
                          variant="secondary"
                        >
                          <Pencil1Icon className="mr-2" /> Change location map
                        </Button>
                      )}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Location on map</DialogTitle>
                        <DialogDescription>
                          The location that will be shown on map
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full space-y-6">
                        <div className="relative w-full">
                          <PlacesAutocomplete
                            defaultValue={form.watch("map_address")}
                            onAddressSelect={(address, coords) => {
                              setLocation(coords);
                              setAddress(address);
                            }}
                          />
                        </div>
                        {isLoaded && (
                          <GoogleMap
                            options={mapOptions}
                            zoom={14}
                            center={mapCenter}
                            mapTypeId={google.maps.MapTypeId.ROADMAP}
                            mapContainerStyle={{
                              width: "100%",
                              height: "400px",
                              borderRadius: "8px",
                              marginTop: "4rem"
                            }}
                          >
                            <MarkerF
                              draggable
                              onDragEnd={e =>
                                setLocation({
                                  lat: e.latLng?.lat() || 0,
                                  lng: e.latLng?.lng() || 0
                                })
                              }
                              position={mapCenter}
                            />
                          </GoogleMap>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              form.setValue("map_address", address);
                              form.setValue("latitude", location?.lat);
                              form.setValue("longitude", location?.lng);
                            }}
                          >
                            Save Location
                          </Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <FormDescription>
                This is the address users will see.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* City and community selects */}
        <div className="flex w-full justify-between space-x-6">
          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={form.watch("city")}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(getLocations)?.map(city => (
                      <SelectItem
                        key={city}
                        value={city}
                        className="capitalize"
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Community */}
          <FormField
            control={form.control}
            name="community"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Community</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={!form.watch("city")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getLocations[form.watch("city") || ""]?.map(
                      (community: string) => (
                        <SelectItem
                          key={community}
                          value={community}
                          className="capitalize"
                        >
                          {community}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button
              type="button"
              onClick={() => {
                setOpenForm(2);
              }}
            >
              Next
            </Button> */}
      </CardFooter>
    </Card>
  );
}
