import {
  fetchCities,
  fetchCommunities,
  getLocations
} from "@/lib/data/location";
import {
  getProperties,
  getPropertyTypes,
  ListingType
} from "@/lib/data/property";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import ListingPreview from "@/modules/home/components/listing-preview";
import {
  Button,
  ButtonIcon,
  ButtonText,
  ChevronDownIcon,
  HStack,
  Icon,
  ScrollView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  VStack
} from "@gluestack-ui/themed";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { capitalize } from "lodash";
import { Search } from "lucide-react-native";
import React, { memo, useCallback, useState } from "react";
import { RefreshControl } from "react-native";

function HomeScreen() {
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { listing_type, property_type, city, community } =
    useLocalSearchParams<{
      listing_type: ListingType;
      property_type: string;
      city: string;
      community: string;
    }>();

  const { data: rentalPropertiesData, isPending: rentalPropertiesLoading } =
    useQuery({
      queryKey: ["rental properties"],
      staleTime: 500,
      queryFn: () => getProperties({ listing_type: "rental", session })
    });

  // Fetches for sale properties
  const { data: salePropertiesData, isPending: salePropertiesLoading } =
    useQuery({
      queryKey: ["sale properties"],
      staleTime: 500,
      queryFn: () => getProperties({ listing_type: "sale", session })
    });

  // Fetches for lease properties
  const { data: leasePropertiesData, isPending: leasePropertiesLoading } =
    useQuery({
      queryKey: ["lease properties"],
      staleTime: 500,
      queryFn: () => getProperties({ listing_type: "lease", session })
    });

  // Fetches for property types
  const { data: propertyTypesData } = useQuery({
    queryKey: ["property types"],
    staleTime: 500,
    queryFn: () => getPropertyTypes()
  });

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => fetchCities(),
    staleTime: Infinity
  });

  const { data: communities } = useQuery({
    queryKey: [city],
    queryFn: () => fetchCommunities(city),
    enabled: city != null && city !== ""
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["rental properties"]
      });
      queryClient.invalidateQueries({
        queryKey: ["sale properties"]
      });
      queryClient.invalidateQueries({
        queryKey: ["lease properties"]
      });
      setRefreshing(false);
    }, 2000);
  }, [refreshing]);

  return (
    <>
      <Stack.Screen />
      <Screen edges={["top"]} paddingTop="$12">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              title="Refreshing..."
              titleColor={"#1aaadd"}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          height="$full"
        >
          <VStack
            minHeight={HEIGHT * 0.2}
            gap="$4"
            rounded="$lg"
            sx={{
              _dark: {
                backgroundColor: "$secondary800"
              },
              _light: {
                backgroundColor: "$white"
              }
            }}
            p="$4"
            justifyContent="space-between"
          >
            <HStack justifyContent="space-between">
              {/* Listing types */}
              <Button
                variant={listing_type !== "rental" ? "outline" : "solid"}
                onPress={() => {
                  router.setParams({ listing_type: "rental" });
                  if (
                    property_type === "land" ||
                    property_type === "warehouse"
                  ) {
                    router.setParams({ property_type: "" });
                  }
                }}
              >
                <ButtonText>Rent</ButtonText>
              </Button>
              <Button
                variant={listing_type !== "sale" ? "outline" : "solid"}
                onPress={() => {
                  router.setParams({ listing_type: "sale" });
                }}
              >
                <ButtonText>Buy</ButtonText>
              </Button>
              <Button
                variant={listing_type !== "lease" ? "outline" : "solid"}
                onPress={() => {
                  router.setParams({ listing_type: "lease" });
                  if (
                    property_type !== "land" &&
                    property_type !== "warehouse"
                  ) {
                    router.setParams({ property_type: "" });
                  }
                }}
              >
                <ButtonText>Lease</ButtonText>
              </Button>
            </HStack>
            {/* Location selects */}
            <VStack justifyContent="space-between" gap="$4">
              {/* Property type */}
              <Select
                onValueChange={value => {
                  router.setParams({ property_type: value });
                }}
              >
                <SelectTrigger variant="outline">
                  <SelectInput
                    value={property_type}
                    placeholder="Select property type"
                  />
                  {/* @ts-ignore */}
                  <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="All" value="All" />
                    {propertyTypesData?.data &&
                      propertyTypesData?.data.map(type => {
                        if (
                          listing_type === "lease" &&
                          (type.name === "land" ||
                            type.name === "warehouse" ||
                            type.name === "bungalow")
                        ) {
                          return (
                            <SelectItem
                              key={type.id}
                              label={capitalize(type.name)}
                              value={capitalize(type.name)}
                            />
                          );
                        }

                        if (
                          listing_type === "rental" &&
                          type.name !== "land" &&
                          type.name !== "warehouse"
                        ) {
                          return (
                            <SelectItem
                              key={type.id}
                              label={capitalize(type.name)}
                              value={capitalize(type.name)}
                            />
                          );
                        }
                        if (listing_type == "sale") {
                          return (
                            <SelectItem
                              key={type.id}
                              label={capitalize(type.name)}
                              value={capitalize(type.name)}
                            />
                          );
                        }
                      })}
                  </SelectContent>
                </SelectPortal>
              </Select>
              {/* City selection */}
              <Select
                onValueChange={value => {
                  if (value == "All") {
                    router.setParams({ city: "All", community: "" });
                    return;
                  }
                  router.setParams({ city: value, community: "" });
                }}
              >
                <SelectTrigger variant="outline">
                  <SelectInput value={city} placeholder="Select City" />
                  {/* @ts-ignore */}
                  <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="All" value="All" />
                    {cities?.data?.map(foundCities => (
                      <SelectItem
                        key={foundCities.id}
                        label={foundCities.name}
                        value={foundCities.name}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              {/* Community selection */}
              <Select
                onValueChange={value => {
                  router.setParams({ community: value });
                }}
                isDisabled={city == "" || city == null || city == "All"}
              >
                <SelectTrigger variant="outline">
                  <SelectInput
                    value={community}
                    placeholder="Select Community"
                  />
                  {/* @ts-ignore */}
                  <SelectIcon mr="$3">
                    <Icon as={ChevronDownIcon} />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="All" value="All" />
                    {city == "" || city == null || city == "All"
                      ? null
                      : communities?.data?.map(community => (
                          <SelectItem
                            key={community.id}
                            label={community.name}
                            value={community.name}
                          />
                        ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            <Button
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: {
                    city,
                    community,
                    listing_type,
                    property_type
                  }
                })
              }
            >
              <ButtonText mr="$2">Search</ButtonText>
              <ButtonIcon size="xl" as={Search} />
            </Button>
          </VStack>

          <ListingPreview
            title="Featured properties for rent"
            listing_type={"rental"}
            properties={rentalPropertiesData?.data!}
            loading={rentalPropertiesLoading}
          />
          <ListingPreview
            title="Featured properties for sale"
            listing_type={"sale"}
            properties={salePropertiesData?.data!}
            loading={salePropertiesLoading}
          />
          <ListingPreview
            title="Featured properties for lease"
            listing_type={"lease"}
            properties={leasePropertiesData?.data!}
            loading={leasePropertiesLoading}
          />
        </ScrollView>
      </Screen>
    </>
  );
}

export default memo(HomeScreen);
