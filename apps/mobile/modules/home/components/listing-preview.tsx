import { HEIGHT, WIDTH } from "@/lib/utils/constants";
import repeat from "@/lib/utils/repeat";
import PropertyCard from "@/modules/property/components/property-card";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Text,
  useColorMode,
  View
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Skeleton } from "moti/skeleton";
import React, { memo } from "react";

type ListingPreviewProps = {
  title: string;
  properties: any[];
  listing_type: string;
  loading: boolean;
};
function ListingPreview({
  title,
  properties,
  loading,
  listing_type
}: ListingPreviewProps) {
  const colorMode = useColorMode();
  const router = useRouter();
  return (
    <View my="$2">
      <View
        flexDirection="row"
        width="$full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="$md" semibold>
          {title}
        </Text>

        <Button
          variant="link"
          paddingHorizontal="$0"
          onPress={() =>
            router.push({
              pathname: "/search",
              params: {
                listing_type
              }
            })
          }
        >
          <ButtonText>See More</ButtonText>
          <ButtonIcon color="$primary500" as={ArrowRight} />
        </Button>
      </View>

      {/* Properties list */}
      <View width="$full" flexDirection="row" height={HEIGHT * 0.4}>
        {/* Loading properties */}
        {loading ? (
          <Skeleton.Group show={loading}>
            {repeat(5).map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  colors={
                    (colorMode as COLORMODES) == "dark"
                      ? ["#262626", "#171717", "#0C0C0C"]
                      : ["#F3F3F3", "#E9E9E9", "#DADADA"]
                  }
                  colorMode={colorMode as any}
                  height={"100%"}
                  width={WIDTH * 0.43}
                />
                <View mr="$4" />
              </React.Fragment>
            ))}
          </Skeleton.Group>
        ) : (
          <FlashList
            decelerationRate={"fast"}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View width="$4" />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              properties?.length === 0 ? (
                <HStack
                  alignItems="center"
                  justifyContent="center"
                  h="$full"
                  w={WIDTH - 32}
                >
                  <Text textAlign="center" opacity="$50" fontWeight="$bold">
                    No properties found
                  </Text>
                </HStack>
              ) : null
            }
            data={properties}
            renderItem={({ item }) => {
              return (
                <View style={{ width: WIDTH * 0.43 }}>
                  <PropertyCard property={item} />
                </View>
              );
            }}
            estimatedItemSize={WIDTH * 0.43}
          />
        )}
      </View>
    </View>
  );
}
export default ListingPreview;
