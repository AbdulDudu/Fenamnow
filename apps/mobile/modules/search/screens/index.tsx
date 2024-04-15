import {
  getProperties,
  getPropertyLeaseDurations,
  getPropertyTypes,
  ListingType
} from "@/lib/data/property";
import { useSession } from "@/lib/providers/session";
import { Screen } from "@/modules/common/ui/screen";
import { Center, HStack, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import ExtraFilters from "../components/extra-filters-sheet";
import LocationSelection from "../components/location-selection";
import MapSheet from "../components/map-sheet";
import SearchResults from "../components/search-results";

export default function SearchScreen() {
  const { session } = useSession();

  const { city, community, listing_type, property_type } =
    useGlobalSearchParams<{
      city: string;
      community: string;
      listing_type: ListingType;
      property_type: string;
    }>();

  const [filters, setFilters] = useState({
    city: city?.toLowerCase(),
    community: community?.toLowerCase(),
    listing_type,
    property_types:
      property_type && property_type !== "All"
        ? [property_type?.toLowerCase()]
        : []
  });

  const [newFilters, setNewFilters] = useState({
    listing_type,
    price_range: [10000, 700000],
    bedrooms: null,
    bathrooms: null,
    property_types: filters.property_types,
    lease_durations: [],
    furnished: true,
    negotiable: true
  });

  const {
    data: properties,
    isError,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    refetch: refetchProperties,
    isFetchingNextPage,
    isPending
  } = useInfiniteQuery({
    select: data => ({
      pages: data.pages.map(page => page).flat()
    }),
    staleTime: 500,
    queryKey: ["search", filters],
    queryFn: () =>
      getProperties({
        session,
        isAdmin: false,
        ...filters
      }),
    initialPageParam: true,
    getNextPageParam: lastPage => lastPage.hasNextPage
  });

  const { data: propertyTypes } = useQuery({
    queryKey: ["property types"],
    queryFn: getPropertyTypes
  });

  const { data: leaseDurationTypes } = useQuery({
    queryKey: ["lease durations"],
    queryFn: getPropertyLeaseDurations
  });

  const applyFilters = () => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };

  const resetFilters = () => {
    setNewFilters({
      listing_type,
      price_range: [10000, 700000],
      bedrooms: null,
      bathrooms: null,
      property_types: filters.property_types,
      lease_durations: [],
      furnished: true,
      negotiable: true
    });
  };
  // console.log(filters);
  return (
    <Screen edges={["bottom"]} width="$full">
      {/* Results count, Map button and filters button */}
      <HStack justifyContent="space-between" my="$2" alignItems="center">
        <Text semibold fontSize="$sm">
          {properties?.pages?.[0]?.count} {listing_type} properties found
        </Text>
        <HStack alignItems="center" space="sm">
          {/* Map Sheet */}
          <MapSheet data={properties!?.pages.map(page => page.data).flat()} />
          {/* Extra Filters Sheet */}
          <ExtraFilters
            filters={newFilters}
            setFilters={setNewFilters}
            propertyTypes={propertyTypes?.data}
            leaseDurationTypes={leaseDurationTypes?.data}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </HStack>
      </HStack>
      {/* Location Selection */}
      <LocationSelection
        city={filters.city}
        community={filters.community}
        setCity={city => {
          setFilters({ ...filters, city: city, community: "" });
        }}
        setCommunity={community => {
          setFilters({ ...filters, community: community });
        }}
      />
      {/* Search Results */}
      <SearchResults
        data={properties!?.pages.map(page => page.data).flat()}
        loading={isPending}
        isError={isError}
        ListFooterComponent={
          <VStack alignItems="center" my={isFetchingNextPage ? "$6" : "$4"}>
            {hasNextPage && isFetchingNextPage && (
              <Center>
                <Spinner />
                <Text semibold fontSize="$md">
                  Loading more properties
                </Text>
              </Center>
            )}
            {properties!?.pages!?.map(page => page.data).flat().length >=
              properties?.pages[0]?.count! && (
              <Text fontSize="$md">All results have been loaded</Text>
            )}
          </VStack>
        }
        onEndReached={() => {
          if (
            properties!?.pages!?.map(page => page.data).flat().length <
            properties?.pages[0]?.count!
          ) {
            fetchNextPage();
          }
        }}
      />
    </Screen>
  );
}
