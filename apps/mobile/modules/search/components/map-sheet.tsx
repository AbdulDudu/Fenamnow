import { Property } from "@/lib/data/property";
import { getPublicUrl } from "@/lib/helpers/supabase";
import { leaseDuration } from "@/lib/utils/constants";
import { nFormatter } from "@/lib/utils/nFormatter";
import { OverlayProvider } from "@gluestack-ui/overlay";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function MapSheet({ data }: { data: any }) {
  const router = useRouter();
  const [showMapSheet, setShowMapSheet] = useState(false);
  return (
    <Center>
      <Button
        disabled={!data}
        onPress={() => setShowMapSheet(true)}
        variant="outline"
      >
        <ButtonText>Map</ButtonText>
      </Button>
      <Actionsheet isOpen={showMapSheet} onClose={() => setShowMapSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent maxHeight="75%">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View width="$full" height="$full">
            <MapView
              userInterfaceStyle="dark"
              provider={PROVIDER_GOOGLE}
              region={{
                latitude:
                  data?.map((data: any) => data)[0]?.latitude || 8.6164444,
                longitude:
                  data?.map((data: any) => data)[0]?.longitude || 13.1954889,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              scrollEnabled
              initialRegion={{
                latitude:
                  data?.map((data: any) => data)[0]?.latitude || 8.6164444,
                longitude:
                  data?.map((data: any) => data)[0]?.longitude || 13.1954889,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
            >
              {data?.map(
                (location: any) =>
                  location?.latitude &&
                  location?.longitude && (
                    <Marker
                      key={location.id}
                      coordinate={{
                        latitude: location?.latitude!,
                        longitude: location?.longitude!
                      }}
                      onPress={() => {
                        setShowMapSheet(false);
                        router.navigate(`/property/${location.id}`);
                      }}
                    >
                      <VStack
                        sx={{
                          _dark: {
                            backgroundColor: "$secondary800"
                          },
                          _light: {
                            backgroundColor: "$white"
                          }
                        }}
                        height="$16"
                        rounded="$lg"
                        w="$24"
                        backgroundColor="$white"
                        p="$1"
                      >
                        <Box w="$full" h="$1/2">
                          <Image
                            style={{ width: "100%", height: "100%" }}
                            source={getPublicUrl(
                              location?.images[0] as string,
                              "properties"
                            )}
                          />
                        </Box>
                        <HStack alignItems="center">
                          <Text fontWeight="$semibold" fontSize="$xs">
                            ${nFormatter(location?.price).toLocaleString()}
                          </Text>
                          {location.lease_duration ? (
                            <Text fontSize="$xs">
                              /
                              {
                                leaseDuration[
                                  location?.lease_duration as string
                                ]
                              }
                            </Text>
                          ) : null}
                        </HStack>
                      </VStack>
                    </Marker>
                  )
              )}
            </MapView>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </Center>
  );
}
