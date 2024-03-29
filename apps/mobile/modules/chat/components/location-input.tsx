import { useChatProviderContext } from "@/lib/providers/chat";
import { HEIGHT } from "@/lib/utils/constants";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  FormControl,
  Icon,
  Input,
  InputField,
  KeyboardAvoidingView,
  Text,
  useColorMode,
  View,
  VStack
} from "@gluestack-ui/themed";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Platform, TextInputProps } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function LocationInput({
  handleMapSheet,
  showLocationSheet
}: {
  handleMapSheet: () => void;
  showLocationSheet: boolean;
}) {
  const { channel } = useChatProviderContext();
  const colorMode = useColorMode();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0
  });
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  useEffect(() => {
    const init = async () => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          toast.error("Location permission not granted");
        }
      }

      const location = await Location.getCurrentPositionAsync();

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    };

    init();
  }, []);

  const sendLocation = ({
    lat,
    lng
  }: {
    lat?: number | undefined;
    lng?: number | undefined;
  }) => {
    channel
      ?.sendMessage({
        attachments: [
          {
            type: "location",
            latitude: lat || location.latitude,
            longitude: lng || location.longitude
          }
        ]
      })
      .then(() => handleMapSheet());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Actionsheet
        isOpen={showLocationSheet}
        onClose={handleMapSheet}
        zIndex={999}
        snapPoints={[90]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent h="$full" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack
            w="$full"
            p="$4"
            mt="$4"
            h="$full"
            flex={1}
            space="lg"
            position="absolute"
            justifyContent="flex-start"
          >
            <Text semibold fontSize={"$lg"}>
              Location
            </Text>

            {/* Location input */}
            <GooglePlacesAutocomplete
              // ref={placesAutoCompleteRef}
              styles={{
                container: {
                  flex: 1,
                  zIndex: 1000,
                  height: "100%",
                  gap: 24
                },
                listView: {
                  height: "200",
                  width: "100%"
                },
                row: {
                  height: HEIGHT * 0.06,
                  justifyContent: "center"
                },
                separator: {
                  height: 1,
                  backgroundColor: colorMode === "dark" ? "#fff" : "#1a1a1a"
                },
                description: {
                  color: colorMode === "dark" ? "#fff" : "#1a1a1a"
                }
              }}
              listViewDisplayed
              suppressDefaultStyles
              enablePoweredByContainer={false}
              placeholder="Start typing to search"
              nearbyPlacesAPI="GoogleReverseGeocoding"
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY,
                language: "en",
                components: "country:sl"
              }}
              keepResultsAfterBlur
              inbetweenCompo={
                <VStack minHeight="35%" space="xl">
                  <View w="$full" flex={1} rounded="$lg">
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      initialRegion={region}
                      style={{
                        flex: 1
                      }}
                    >
                      <Marker
                        coordinate={location}
                        draggable
                        onDragEnd={e => {
                          setLocation({
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                          });
                        }}
                      />
                    </MapView>
                  </View>
                  <ActionsheetItem
                    px="-$2"
                    h="$12"
                    onPress={() =>
                      sendLocation({
                        lat: location.latitude,
                        lng: location.longitude
                      })
                    }
                  >
                    <ActionsheetIcon>
                      <Icon as={MapPin} color="$primary400" />
                    </ActionsheetIcon>

                    <ActionsheetItemText color="$primary400">
                      Send Current Location
                    </ActionsheetItemText>
                  </ActionsheetItem>
                </VStack>
              }
              onPress={(_data, details) =>
                sendLocation({
                  lat: details?.geometry.location.lat,
                  lng: details?.geometry.location.lng
                })
              }
              fetchDetails
              textInputProps={{
                InputComp: ({ ...props }: TextInputProps) => (
                  <Input w="$full">
                    <InputField
                      placeholder={props.placeholder || ""}
                      onChangeText={props.onChangeText}
                    />
                  </Input>
                ),
                errorStyle: { color: "red" }
              }}
            />
            {/* Map view */}
            {/* <ActionsheetItem onPress={sendLocation}>
            <ActionsheetIcon>
              <Icon as={MapPin} color="$primary400" />
            </ActionsheetIcon>

            <ActionsheetItemText color="$primary400">
              Send Current Location
            </ActionsheetItemText>
          </ActionsheetItem> */}

            {/* <ActionsheetVirtualizedList
              h="$56"
              data={data}
              initialNumToRender={5}
              renderItem={({ item }) => <Item title={item.title} />}
              keyExtractor={item => item.id}
              getItemCount={getItemCount}
              getItem={getItem}
            /> */}
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </KeyboardAvoidingView>
  );
}
