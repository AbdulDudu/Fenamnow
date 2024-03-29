import { getFavorites } from "@/lib/data/property";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import PropertyCard from "@/modules/property/components/property-card";
import { Center, Spinner, Text, View } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useState } from "react";
import { RefreshControl } from "react-native";

function SavedScreen() {
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: favouritesData,
    // error,
    fetchNextPage,
    // hasNextPage,
    isRefetching,
    refetch: refetchFavourites,
    isFetchingNextPage,
    isPending
  } = useInfiniteQuery({
    select: data => ({
      pages: data.pages.map(page => page).flat()
    }),
    queryKey: ["favourites", session?.user.id],
    queryFn: () => getFavorites({ session }),
    initialPageParam: true,
    getNextPageParam: lastPage => lastPage.hasNextPage
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchFavourites();
      setRefreshing(false);
    }, 2000);
  }, [isRefetching]);

  if (!session) {
    return <ScreenProtector />;
  }
  if (isPending) {
    return (
      <Screen justifyContent="center" gap="$4" alignItems="center">
        <Text fontSize="$lg" semibold>
          Loading saved properties
        </Text>
        <Spinner size="large" />
      </Screen>
    );
  }

  if (
    !isPending &&
    favouritesData?.pages.map(page => page.data).flat().length === 0
  ) {
    return (
      <Screen justifyContent="center" gap="$4" alignItems="center">
        <Text fontSize="$lg" semibold>
          No saved properties
        </Text>
      </Screen>
    );
  }

  return (
    <Screen edges={[]} pt="$4" width="$full">
      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            title="Refreshing saved properties"
            titleColor={"#1aaadd"}
            onRefresh={onRefresh}
          />
        }
        numColumns={2}
        data={favouritesData!?.pages.map(page => page.data).flat()}
        ListFooterComponent={
          favouritesData!?.pages!?.map(page => page.data).flat()?.length <=
            favouritesData!?.pages[0]?.count! && isFetchingNextPage ? (
            <Spinner />
          ) : (
            <View w="$full" my="$4">
              <Text textAlign="center">All saved properties loaded</Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View height="$4" />}
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
              <PropertyCard property={item?.property_id} />
            </Center>
          );
        }}
        estimatedItemSize={HEIGHT * 0.4}
        onEndReached={() => {
          if (
            favouritesData!?.pages!?.map(page => page.data).flat()?.length <
            favouritesData!?.pages[0]?.count!
          )
            fetchNextPage();
        }}
      />
    </Screen>
  );
}

export default memo(SavedScreen);
