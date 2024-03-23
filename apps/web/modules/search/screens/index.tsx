"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@fenamnow/ui/components/ui/drawer";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getProperties } from "@web/lib/queries/properties";
import { MAP_LIBRARIES } from "@web/lib/utils/constants";
import { findMapCenter } from "@web/lib/utils/find-map-center";
import SearchPagination from "@web/modules/common/shared/pagination";
import { useSession } from "@web/modules/common/shared/providers/session";
import { Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SearchFilters from "../components/filters";
import SearchResultsList from "../components/results-list";
import ResultsMap from "../components/results-map";

export type SearchScreenProps = {
  params: { listing_type: "sale" | "rental" | "lease" };
  searchParams: {
    city: string;
    community: string;
    property_type: string;
  };
};
export default function SearchScreen({
  params,
  searchParams
}: SearchScreenProps) {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  const [locationAccess, setLocationAccess] = useState<PermissionState>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES as Libraries
  });

  const [filters, setFilters] = useState({
    city: searchParams.city,
    community: searchParams.community,
    listing_type: params.listing_type,
    property_types:
      searchParams.property_type && searchParams.property_type !== "all"
        ? [searchParams.property_type]
        : []
  });

  const [newFilters, setNewFilters] = useState({
    listing_type: filters.listing_type,
    price_range: [10000, 700000],
    bedrooms: null,
    bathrooms: null,
    property_types: filters.property_types,
    lease_durations: [],
    furnished: true,
    negotiable: true
  });

  const { data: properties, count } = useQuery(
    getProperties({
      client: supabase,
      session,
      isAdmin: false,
      ...filters
    })
  );

  const mapCenter = useMemo<google.maps.LatLngLiteral>(
    () =>
      (properties &&
        properties?.length > 0 &&
        findMapCenter(
          properties?.map(property => {
            return {
              latitude: property.latitude as number,
              longitude: property.longitude as number
            };
          }) as { latitude: number; longitude: number }[]
        )) || {
        lat: location?.lat || 0,
        lng: location?.lng || 0
      },
    [location, properties]
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

  console.log("Params: ", params.listing_type);
  console.log("Search params: ", searchParams);

  return (
    <div className="container w-full space-y-8">
      <div className="flex min-h-screen w-full md:h-[90vh]">
        <ResultsMap
          isLoaded={isLoaded}
          properties={properties}
          mapCenter={mapCenter}
          className="hidden md:flex"
        />
        <div className="container flex size-full flex-col space-y-4 md:w-1/2">
          <div className="-mb-4 flex w-full justify-between">
            <h4>Search Results</h4>

            <Drawer>
              <DrawerTrigger asChild>
                <Button className="md:hidden" variant="secondary">
                  <Map size={16} className="mr-2" />
                  Map
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle>Map</DrawerTitle>
                </DrawerHeader>
                <div className="h-[75vh] w-full">
                  <ResultsMap
                    isLoaded={isLoaded}
                    properties={properties}
                    mapCenter={mapCenter}
                    className="w-full md:hidden"
                  />
                </div>
                <DrawerFooter>
                  <DrawerClose className="w-full">
                    <Button variant="outline" className="w-full">
                      Close
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <p>
            {count} {params.listing_type} properties found
          </p>
          <SearchFilters />
          <SearchResultsList
            count={count}
            listing_type={params.listing_type}
            properties={properties}
          />

          {count && <SearchPagination count={count} />}
        </div>
      </div>
    </div>
  );
}
