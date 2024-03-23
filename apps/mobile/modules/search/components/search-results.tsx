import { Property } from "@/lib/data/property";
import { HEIGHT, WIDTH } from "@/lib/utils/constants";
import repeat from "@/lib/utils/repeat";
import EmptyList from "@/modules/common/ui/empty-list";
import ListError from "@/modules/common/ui/list-error";
import PropertyCard from "@/modules/property/components/property-card";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import {
  Center,
  HStack,
  RefreshControl,
  useColorMode,
  View
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useState } from "react";

export default function SearchResults({
  data,
  loading,
  isError,
  onEndReached,
  ListFooterComponent
}: {
  data: any;
  loading: boolean;
  isError: boolean;
  onEndReached: (() => void) | null | undefined;
  ListFooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
}) {
  const colorMode = useColorMode();
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);
  const renderItem = ({ item, index }: { item: Property; index: number }) => {
    return (
      <Center
        width="$full"
        mb="$4"
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
        <PropertyCard property={item} />
      </Center>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["search"]
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  if (isError) {
    return <ListError />;
  }

  if (loading) {
    return (
      <Skeleton.Group show>
        {repeat(2).map((_, i) => (
          <HStack key={i} justifyContent="space-between" mb="$4">
            <Skeleton
              colors={
                (colorMode as COLORMODES) == "dark"
                  ? ["#262626", "#171717", "#0C0C0C"]
                  : ["#F3F3F3", "#E9E9E9", "#DADADA"]
              }
              colorMode={colorMode as any}
              height={HEIGHT * 0.4}
              width={WIDTH * 0.43}
            />
            <Skeleton
              colors={
                (colorMode as COLORMODES) == "dark"
                  ? ["#262626", "#171717", "#0C0C0C"]
                  : ["#F3F3F3", "#E9E9E9", "#DADADA"]
              }
              colorMode={colorMode as any}
              height={HEIGHT * 0.4}
              width={WIDTH * 0.43}
            />
          </HStack>
        ))}
      </Skeleton.Group>
    );
  }
  return (
    <View flex={1}>
      <FlashList
        onRefresh={onRefresh}
        refreshing={refreshing}
        numColumns={2}
        data={data}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={HEIGHT * 0.4}
        ListEmptyComponent={<EmptyList />}
        renderItem={renderItem}
        onEndReachedThreshold={0.25}
        onEndReached={onEndReached}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}
