import { getLocations } from "@/lib/data/location";
import { propertyInsertFormSchema } from "@/lib/schemas/form-schemas";
import { HEIGHT } from "@/lib/utils/constants";
import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  ChevronDownIcon,
  CloseIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
  InputSlot,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
  Text,
  useColorMode,
  VStack
} from "@gluestack-ui/themed";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as z from "zod";

export default function AddressForm({
  control,
  watch,
  setValue,
  errors
}: {
  control: Control<z.infer<typeof propertyInsertFormSchema>> & any;
  watch: UseFormWatch<z.infer<typeof propertyInsertFormSchema>>;
  setValue: UseFormSetValue<z.infer<typeof propertyInsertFormSchema>>;
  errors: FieldErrors<z.infer<typeof propertyInsertFormSchema>>;
  latitude?: number;
  longitude?: number;
}) {
  const [showMapLocationInput, setShowMapLocationInput] = useState(false);
  const handleClose = () => setShowMapLocationInput(!showMapLocationInput);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [locationError, setLocationError] = useState("");
  const colorMode = useColorMode();
  const placesAutoCompleteRef = useRef<
    GooglePlacesAutocompleteRef | undefined
  >();

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
      if (watch("latitude") != undefined && watch("longitude") != undefined) {
        setLocation({
          ...location,
          coords: {
            ...location.coords,
            latitude: watch("latitude") || location.coords.latitude || 0,
            longitude: watch("longitude") || location.coords.longitude || 0
          }
        });
        setAddress(watch("map_address"));
        placesAutoCompleteRef?.current?.setAddressText(watch("map_address"));
        return;
      }
      setLocation(location);
    })();
  }, [watch]);

  // useEffect(() => {
  //   placesAutoCompleteRef?.current?.setAddressText(address);
  // }, []);

  return (
    <Box
      gap="$4"
      sx={{
        _dark: {
          backgroundColor: "$secondary800"
        },
        _light: {
          backgroundColor: "$white"
        }
      }}
      display="flex"
      width="$full"
      p="$4"
      my="$6"
      rounded="$lg"
    >
      <Heading my="$2">Location</Heading>
      <Text fontSize="$sm">Details about where the property is located</Text>
      {/* Address Field */}
      <Controller
        control={control}
        name="address"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            isRequired
            isInvalid={errors.address?.message !== undefined}
            flex={1}
          >
            <FormControlLabel>
              <FormControlLabelText>Address</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={value}
                defaultValue={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Address"
              />
              <InputSlot>
                <Center>
                  <Button
                    size="xs"
                    px="$2"
                    variant="outline"
                    onPress={handleClose}
                  >
                    <ButtonText>
                      {watch("latitude") != undefined &&
                      watch("longitude") != undefined
                        ? "Change location"
                        : "Add location"}
                    </ButtonText>
                  </Button>
                </Center>
              </InputSlot>
            </Input>

            <FormControlHelper>
              <FormControlHelperText>
                The address shown to other users
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors?.address?.message as string}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="city"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            isRequired
            isInvalid={errors.city?.message !== undefined}
          >
            <FormControlLabel>
              <FormControlLabelText>City</FormControlLabelText>
            </FormControlLabel>

            <Select
              isInvalid={errors.city?.message != undefined}
              onValueChange={onChange}
              defaultValue={value}
              selectedValue={value}
            >
              <SelectTrigger variant="outline" size="md" onBlur={onBlur}>
                <SelectInput placeholder="Select City" />
                {/* @ts-ignore */}
                <SelectIcon mr="$2">
                  <Icon as={ChevronDownIcon} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {Object.keys(getLocations).map(city => (
                    <SelectItem key={city} label={city} value={city} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            <FormControlHelper>
              <FormControlHelperText>
                You can only select one option
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.city?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        rules={{ required: true }}
        name="community"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            isRequired
            isDisabled={watch("city") == "" || watch("city") == undefined}
            isInvalid={errors.community?.message != undefined}
          >
            <FormControlLabel>
              <FormControlLabelText>Community</FormControlLabelText>
            </FormControlLabel>

            <Select
              onValueChange={onChange}
              defaultValue={value}
              selectedValue={value}
            >
              <SelectTrigger variant="outline" size="md" onBlur={onBlur}>
                <SelectInput placeholder="Select Community" />
                {/* @ts-ignore */}
                <SelectIcon mr="$2">
                  <Icon as={ChevronDownIcon} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {getLocations[watch("city") ?? ""]?.map(community => (
                    <SelectItem
                      key={community}
                      label={community}
                      value={community}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

            <FormControlHelper>
              <FormControlHelperText>
                You can only select one option
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.community?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      <Center position="absolute">
        <Modal
          height={HEIGHT}
          avoidKeyboard
          isOpen={showMapLocationInput}
          onClose={() => {
            setShowMapLocationInput(false);
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text fontFamily="NotoSans_700Bold" fontSize="$xl">
                Location on map
              </Text>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody height={HEIGHT * 0.5} position="relative">
              <GooglePlacesAutocomplete
                // @ts-ignore
                ref={placesAutoCompleteRef}
                styles={{
                  container: {
                    zIndex: 999,
                    position: "absolute",
                    width: "100%",
                    height: HEIGHT
                  },
                  textInput: {
                    height: 38,
                    backgroundColor: "transparent",
                    fontFamily: "NotoSans_700Bold",
                    borderColor: "#525252",
                    borderWidth: 1,
                    fontSize: 16
                  },
                  listView: {
                    height: 200,
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
                  details?.geometry.location &&
                    setLocation({
                      ...location,
                      // @ts-ignore
                      coords: {
                        ...location?.coords,
                        latitude: details?.geometry?.location.lat! as number,
                        longitude: details?.geometry?.location.lng! as number
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
              <VStack height={HEIGHT * 0.45} width="$full">
                {location != null && locationError.length === 0 ? (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                      latitude: location?.coords.latitude!,
                      longitude: location?.coords.longitude!,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    }}
                    style={{
                      width: "100%",
                      height: "90%",
                      marginTop: 54,
                      borderRadius: 8
                    }}
                    zoomControlEnabled
                    region={{
                      latitude: location?.coords.latitude!,
                      longitude: location?.coords.longitude!,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    }}
                  >
                    {location?.coords.latitude && location?.coords.longitude ? (
                      <Marker
                        draggable
                        onDragEnd={e => {
                          setLocation({
                            ...location,
                            coords: {
                              ...location.coords,
                              latitude: e.nativeEvent.coordinate.latitude,
                              longitude: e.nativeEvent.coordinate.longitude
                            }
                          });
                        }}
                        coordinate={{
                          latitude: location?.coords.latitude,
                          longitude: location?.coords.longitude
                        }}
                      />
                    ) : null}
                  </MapView>
                ) : (
                  <Center height="$full" gap="$4" width="$full" mt="$12">
                    <Text fontWeight="$semibold">{locationError}</Text>
                    <Button
                      onPress={async () => {
                        const { status } =
                          await Location.requestForegroundPermissionsAsync();

                        status == "granted" && setLocationError("");
                      }}
                    >
                      <ButtonText>Grant location access</ButtonText>
                    </Button>
                  </Center>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowMapLocationInput(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                onPress={() => {
                  setValue("longitude", location?.coords.longitude!);
                  setValue("latitude", location?.coords.latitude!);
                  setValue("map_address", address);
                  setShowMapLocationInput(false);
                }}
              >
                <ButtonText>Save location</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    </Box>
  );
}
