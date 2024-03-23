import { AnimatedView } from "@/modules/common/ui/animated-view";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  Button,
  ButtonIcon,
  ButtonText,
  CloseIcon,
  HStack,
  KeyboardAvoidingView,
  SearchIcon,
  Text,
  useColorMode,
  View,
  VStack
} from "@gluestack-ui/themed";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function LocationSheet({
  openLocationSheet,
  handleLocationSheetClose,
  sendLocation
}: {
  openLocationSheet: boolean;
  handleLocationSheetClose: any;
  sendLocation: (location: Location.LocationObject | null) => void;
}) {
  const colorMode = useColorMode();
  const [showSearch, setShowSearch] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState("");

  const placesAutoCompleteRef = useRef<
    GooglePlacesAutocompleteRef | undefined
  >();

  const handleLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    if (status == "granted") {
      setLocationError("");
    }
  };

  useEffect(() => {
    (async () => {
      let { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setLocationError("Location permission not granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setCurrentLocation(location);
    })();
  }, [openLocationSheet]);

  return (
    <Actionsheet
      isOpen={openLocationSheet}
      onClose={handleLocationSheetClose}
      snapPoints={[80]}
      trapFocus={false}
      zIndex={999}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent height="$full" zIndex={999}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "height" : "height"}
          style={{ width: "100%", zIndex: 999 }}
        >
          <VStack width="$full" px="$2" justifyContent="space-between">
            {!showSearch ? (
              <AnimatedView mt="$5" width="$full">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text semibold fontSize="$2xl">
                    Location
                  </Text>
                  <Button
                    variant="link"
                    onPress={() => setShowSearch(!showSearch)}
                  >
                    <ButtonIcon size="xl" as={SearchIcon} />
                  </Button>
                </HStack>
              </AnimatedView>
            ) : (
              <AnimatedView
                position="relative"
                zIndex={2000}
                top="$5"
                width="$full"
              >
                <HStack
                  width="$full"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <GooglePlacesAutocomplete
                    // @ts-ignore
                    ref={placesAutoCompleteRef}
                    styles={{
                      container: {
                        zIndex: 1000,
                        position: "absolute",
                        width: "85%",
                        left: 0,
                        top: 0,
                        height: 400
                      },
                      textInput: {
                        height: 38,
                        backgroundColor: "transparent",
                        fontFamily: "Inter_700Bold",
                        borderColor: "#525252",
                        color: colorMode == "dark" ? "#F5F5F5" : "#262626",
                        borderWidth: 1,
                        fontSize: 16
                      },
                      listView: {
                        width: "100%",
                        backgroundColor: "transparent"
                      }
                    }}
                    placeholder="Start typing to find location"
                    fetchDetails
                    textInputProps={{
                      defaultValue: address,
                      placeholderTextColor:
                        colorMode == "dark" ? "#737373" : "#262626",
                      value: address,
                      onChangeText: text => setAddress(text)
                    }}
                    debounce={300}
                    keepResultsAfterBlur
                    enablePoweredByContainer
                    onPress={(_data, details) => {
                      setAddress(details?.formatted_address!);
                      setSelectedAddress(details?.formatted_address!);
                      details?.geometry.location &&
                        setCurrentLocation({
                          ...currentLocation,
                          // @ts-ignore
                          coords: {
                            ...currentLocation?.coords,
                            latitude: details?.geometry?.location
                              .lat! as number,
                            longitude: details?.geometry?.location
                              .lng! as number
                          }
                        });
                    }}
                    onFail={error => console.error(error)}
                    nearbyPlacesAPI="GoogleReverseGeocoding"
                    query={{
                      key: process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY,
                      language: "en",
                      components: "country:sl"
                    }}
                  />
                  <Button
                    variant="link"
                    onPress={() => setShowSearch(!showSearch)}
                  >
                    <ButtonIcon size="xl" as={CloseIcon} />
                  </Button>
                </HStack>
              </AnimatedView>
            )}

            {locationError?.length > 0 ? (
              <VStack
                width="$full"
                justifyContent="center"
                alignItems="center"
                position="relative"
                space="2xl"
                height="60%"
              >
                <Text semibold>You need to provide location access</Text>
                <Button onPress={async () => await handleLocationAccess()}>
                  <ButtonText>Grant Location access</ButtonText>
                </Button>
              </VStack>
            ) : (
              <View width="$full" mt={showSearch ? "$11" : "$6"} height="60%">
                <MapView
                  initialRegion={{
                    latitude: currentLocation?.coords.latitude || 0,
                    longitude: currentLocation?.coords.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  region={{
                    latitude: currentLocation?.coords.latitude || 0,
                    longitude: currentLocation?.coords.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  provider={PROVIDER_GOOGLE}
                  style={{ flex: 1 }}
                >
                  {currentLocation?.coords.latitude &&
                  currentLocation?.coords.longitude ? (
                    <Marker
                      draggable
                      onDragEnd={e => {
                        setCurrentLocation({
                          ...currentLocation,
                          coords: {
                            ...currentLocation.coords,
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                          }
                        });
                      }}
                      coordinate={{
                        latitude: currentLocation?.coords.latitude,
                        longitude: currentLocation?.coords.longitude
                      }}
                    />
                  ) : null}
                </MapView>
              </View>
            )}
            <Button
              variant="outline"
              onPress={async () => {
                let location = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.High
                });
                sendLocation(location);
                setSelectedAddress("");
                handleLocationSheetClose();
              }}
            >
              <ButtonText>Send your current location</ButtonText>
            </Button>
            <Text semibold>Other location</Text>
            <ActionsheetItem
              onPress={() => {
                sendLocation(currentLocation);
                setSelectedAddress("");
                handleLocationSheetClose();
              }}
            >
              <ActionsheetItemText>{selectedAddress}</ActionsheetItemText>
            </ActionsheetItem>
          </VStack>
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
