import { HEIGHT } from "@/lib/utils/constants";
import {
  ArrowDownIcon,
  RefreshControl,
  ScrollView,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export default function ListError({ text }: { text?: string }) {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["search"]
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          title="Refreshing search results"
          onRefresh={onRefresh}
        />
      }
    >
      <VStack
        alignItems="center"
        justifyContent="center"
        flex={1}
        height={HEIGHT * 0.75}
        space="lg"
      >
        <Text fontSize="$lg" semibold textAlign="center" width="$2/3">
          {text || "Error encountered while fetching results"}
        </Text>
        <Text>Pull down to refresh</Text>

        <ArrowDownIcon size="xl" />
      </VStack>
    </ScrollView>
  );
}
