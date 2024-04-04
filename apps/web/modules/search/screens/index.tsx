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
import { useQuery } from "@tanstack/react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getProperties } from "@web/lib/queries/properties";
import { MAP_LIBRARIES } from "@web/lib/utils/constants";
import { findMapCenter } from "@web/lib/utils/find-map-center";
import SearchPagination from "@web/modules/common/shared/pagination";
import { useSession } from "@web/modules/common/shared/providers/session";
import { Map } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchFilters } from "../components/filters";
import SearchResultsList from "../components/results-list";
import ResultsMap from "../components/results-map";

export type SearchScreenProps = {
  params: { listing_type: "sale" | "rental" | "lease" };
  searchParams: {
    city: string;
    community: string;
    property_type: string;
    page: number;
  };
};
export default function SearchScreen() {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || undefined;
  const community = searchParams.get("community") || undefined;
  const property_type = searchParams.get("property_type");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 0;
  const params = {
    listing_type: pathname.split("/")[3] as "sale" | "rental" | "lease"
  };
  const [locationAccess, setLocationAccess] = useState<PermissionState>();
  const [location, setLocation] = useState<google.maps.LatLngLiteral>();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES as Libraries
  });

  const [filters, setFilters] = useState({
    city,
    community,
    listing_type: params.listing_type,
    property_types:
      property_type && property_type !== "all" ? [property_type] : []
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

  const { data: properties } = useQuery({
    queryKey: [filters, page],
    queryFn: async () =>
      await getProperties({
        client: supabase,
        session,
        start: (page - 1) * 5,
        end: page * 5,
        ...filters
      }),
    staleTime: 500
  });

  console.log(city, properties?.data);

  const mapCenter = useMemo<google.maps.LatLngLiteral>(
    () =>
      (properties &&
        properties.data &&
        properties.data.length > 0 &&
        findMapCenter(
          properties.data?.map(property => {
            return {
              latitude: property.latitude as number,
              longitude: property.longitude as number
            };
          }) as { latitude: number; longitude: number }[]
        )) || {
        lat: location?.lat || 0,
        lng: location?.lng || 0
      },
    [location, properties?.data, filters]
  );

  const applyFilters = () => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };

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
    <div className="container w-full space-y-8">
      <div className="flex h-screen w-full md:h-[90vh]">
        <ResultsMap
          isLoaded={isLoaded}
          properties={properties?.data}
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
                    properties={properties?.data}
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
            {properties?.count} {params.listing_type} properties found
          </p>
          <SearchFilters
            newFilters={newFilters}
            setNewFilters={setNewFilters}
            applyFilters={applyFilters}
          />
          <SearchResultsList
            count={properties?.count}
            listing_type={params.listing_type}
            properties={properties?.data}
          />

          {properties?.count && <SearchPagination count={properties.count} />}
        </div>
      </div>
    </div>
  );
}
