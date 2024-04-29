import { getProperties } from "@/lib/data/property";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import {
  AddIcon,
  Button,
  ButtonText,
  Center,
  Fab,
  FabIcon,
  FabLabel,
  Spinner,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import PropertyCard from "../../property/components/property-card";

export default function PropertiesListScreen() {
  const { session } = useSession();

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

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
    queryKey: ["properties", session?.user.id],
    queryFn: () => getProperties({ session, isAdmin: true }),
    initialPageParam: true,
    getNextPageParam: lastPage => lastPage.hasNextPage
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchProperties();
      setRefreshing(false);
    }, 2000);
  }, [isRefetching]);

  if (isPending) {
    return (
      <Screen justifyContent="center" gap="$4" alignItems="center">
        <Text fontSize="$lg" semibold>
          Loading properties
        </Text>
        <Spinner size="large" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen justifyContent="center" gap="$4" alignItems="center">
        <Text textAlign="center" fontSize="$lg" semibold>
          Encountered an error while retrieving properties
        </Text>
        <Button onPress={() => refetchProperties()}>
          <ButtonText>Try again</ButtonText>
        </Button>
      </Screen>
    );
  }
  return (
    <Screen width="$full" pt="$4" edges={["bottom"]}>
      {properties?.pages.map(page => page.data).flat().length == 0 ? (
        <>
          <VStack
            alignItems="center"
            gap="$2.5"
            justifyContent="center"
            height="$full"
          >
            <Text fontSize="$lg" fontWeight="$medium">
              No Results Found
            </Text>
          </VStack>
        </>
      ) : (
        <FlashList
          decelerationRate="fast"
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              title="Refreshing saved properties"
              titleColor={"#1aaadd"}
              onRefresh={onRefresh}
            />
          }
          refreshing={refreshing}
          ItemSeparatorComponent={() => <View height="$4" />}
          ListFooterComponent={() => (
            <VStack alignItems="center" my={isFetchingNextPage ? "$6" : "$4"}>
              {hasNextPage && isFetchingNextPage && (
                <>
                  <Spinner />
                  <Text semibold>Loading more properties</Text>
                </>
              )}
              {properties!?.pages!?.map(page => page.data).flat().length >=
                properties?.pages[0]?.count! && (
                <Text>All your properties have been loaded</Text>
              )}
            </VStack>
          )}
          showsVerticalScrollIndicator={false}
          data={properties?.pages.map(page => page.data).flat()}
          keyExtractor={item => item?.id.toString() || ""}
          renderItem={({ item, index }) => {
            return (
              <Center
                width="$full"
                sx={
                  index % 2 == 0
                    ? {
                        pr: "$3",
                        pl: "$0"
                      }
                    : {
                        pr: "$1",
                        pl: "$2"
                      }
                }
              >
                <PropertyCard property={item} isDashboard />
              </Center>
            );
          }}
          onEndReached={() => {
            if (
              properties!?.pages!?.map(page => page.data).flat().length <
              properties?.pages[0]?.count!
            ) {
              fetchNextPage();
            }
          }}
          estimatedItemSize={HEIGHT * 0.4}
        />
      )}
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        mb="$6"
        onPress={() => router.push("/(drawer)/(properties)/edit")}
        mr="$4"
      >
        <FabIcon as={AddIcon} mr="$1" />
        <FabLabel>New Property</FabLabel>
      </Fab>
    </Screen>
  );
}
