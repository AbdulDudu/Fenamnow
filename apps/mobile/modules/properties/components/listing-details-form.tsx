import {
  getAmenities,
  getPropertyLeaseDurations,
  getPropertyListingTypes,
  getPropertyTypes,
  upsertProperty
} from "@/lib/data/property";
import { getPublicUrl, supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { propertyInsertFormSchema } from "@/lib/schemas/form-schemas";
import { CAMERA_TYPE, HEIGHT, MEDIA_TYPE } from "@/lib/utils/constants";
import { pickMedia, takeMedia, upload } from "@/lib/utils/files";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { Database } from "@fenamnow/types/database";
import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  Center,
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  ChevronDownIcon,
  CloseIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Menu,
  MenuItem,
  MenuItemLabel,
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
  Switch,
  Text,
  Textarea,
  TextareaInput,
  useColorMode,
  View,
  VStack
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import dayjs from "dayjs";
import { ResizeMode, Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { capitalize } from "lodash";
import {
  CameraIcon,
  CheckIcon,
  DollarSign,
  GalleryHorizontal,
  PlayIcon,
  PlusIcon,
  TrashIcon
} from "lucide-react-native";
import { customAlphabet } from "nanoid";
import React, { useCallback, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import * as z from "zod";

export default function ListingDetailsForm({
  control,
  watch,
  // setValue,
  errors,
  handleSubmit
}: {
  control: Control<z.infer<typeof propertyInsertFormSchema>> & any;
  watch: UseFormWatch<z.infer<typeof propertyInsertFormSchema>>;
  setValue: UseFormSetValue<z.infer<typeof propertyInsertFormSchema>>;
  errors: FieldErrors<z.infer<typeof propertyInsertFormSchema>>;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof propertyInsertFormSchema>> &
    any;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { session } = useSession();
  const videoRef = useRef<Video>(null);
  const finalFocusRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState<any>({});
  const [date, setDate] = useState<DateType>(dayjs());
  const [year, setYear] = useState<DateType>(dayjs().year());
  const colorMode = useColorMode();
  const [loading, setLoading] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const { id } = useGlobalSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: propertyTypes } = useQuery({
    queryKey: ["property types"],
    queryFn: getPropertyTypes
  });

  const { data: listingTypes } = useQuery({
    queryKey: ["listing types"],
    queryFn: getPropertyListingTypes
  });

  const { data: leaseDurationTypes } = useQuery({
    queryKey: ["lease durations"],
    queryFn: getPropertyLeaseDurations
  });

  const { data: availableAmenitiesData } = useQuery({
    queryKey: ["available amenities"],
    queryFn: getAmenities
  });

  const numberFormatter = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  const onSubmit = async (data: z.infer<typeof propertyInsertFormSchema>) => {
    try {
      setSavingProperty(true);
      const referenceCode = customAlphabet(
        "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        8
      )();
      const uploadedImages = data.images.map(async image => {
        if (image.hasOwnProperty("assetId")) {
          const file = image as ImagePicker.ImagePickerAsset;
          const fileExt = file.uri.split(".").pop()?.toLowerCase();
          const filePath = `${id ? data?.reference_code : referenceCode}/images/${Math.random()}.${fileExt}`;
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: "base64"
          });

          const form = new FormData();
          form.append("file", file as any);

          const contentType = `${(file as ImagePicker.ImagePickerAsset).type}/${fileExt}`;

          const { data: imageData, error } = await supabase.storage
            .from("properties")
            .upload(filePath, decode(base64), { contentType });

          if (error) {
            throw error;
          }
          return {
            uri: imageData.path,
            alt: image.alt || ""
          };
        }
        return {
          uri: image.uri,
          alt: image.alt || ""
        };
      });

      const imagesPromise = Promise.all(uploadedImages);
      toast.promise(
        imagesPromise,
        {
          loading: "Uploading images",
          success: () => "Images uploaded successfully",
          error: err => err.message.toString()
        },
        {
          position: ToastPosition.TOP,
          providerKey: "property-edit-modal"
        }
      );

      const images = (await imagesPromise).map(image => image);
      const video = async () => {
        if (data.video_tour && data.video_tour.hasOwnProperty("assetId")) {
          const file = data.video_tour as ImagePicker.ImagePickerAsset;
          const fileExt = file.uri.split(".").pop()?.toLowerCase();
          const filePath = `${id ? data?.reference_code : referenceCode}/video/${Math.random()}.${fileExt}`;
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: "base64"
          });

          const form = new FormData();
          form.append("file", file as any);
          const contentType = `${(file as ImagePicker.ImagePickerAsset).type}/${fileExt}`;

          const { data: videoData, error: uploadVideoError } =
            await supabase.storage
              .from("properties")
              .upload(filePath, decode(base64), { contentType });

          if (uploadVideoError) {
            throw uploadVideoError;
          }

          const { data: uploadedVideo, error: uploadedVideoError } =
            await supabase
              .from("videos")
              .insert({
                uri: videoData.path
              })
              .select()
              .single();
          if (uploadedVideoError) {
            throw uploadedVideoError;
          }
          return uploadedVideo.id;
        }
        return (data?.video_tour as { id?: string })?.id;
      };

      toast.promise(
        video(),
        {
          loading: "Uploading Video tour",
          success: () => "Video tour uploaded successfully",
          error: err => err.message.toString()
        },
        {
          position: ToastPosition.TOP,
          providerKey: "property-edit-modal"
        }
      );
      const video_tour = await video();

      // @ts-ignore
      const { error } = await supabase
        .from("properties")
        .upsert({
          id: id ? parseInt(id as unknown as string) : undefined,
          user_id: session?.user.id,
          address: data.address as string,
          city: data.city,
          community: data.community,
          latitude: data.latitude,
          longitude: data.longitude,
          map_address: data.map_address,
          date_available: new Date(data.date_available).toISOString(),
          description: data.description,
          listing_type: data.listing_type,
          lease_duration: data.lease_duration,
          price: data.price,
          property_type: data.property_type,
          bathrooms: data.bathrooms,
          bedrooms: data.bedrooms,
          property_size: data.property_size,
          images,
          video_tour: video_tour,
          amenities: data.amenities,
          reference_code: referenceCode,
          status: "available"
        })
        .select()
        .single();

      if (error) {
        console.log(error);
        throw error;
      }

      toast.success(
        id
          ? "Property updated successfully"
          : "New property added successfully",
        {
          position: ToastPosition.TOP,
          providerKey: "property-edit-modal"
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["properties", session?.user.id]
      });
      queryClient.invalidateQueries({
        queryKey: ["property edit", id]
      });
      router.replace("../");
    } catch (error: any) {
      console.log(error);
      toast.error(`Something went wrong! ${error.message}`, {
        position: ToastPosition.TOP,
        providerKey: "property-edit-modal"
      });
    } finally {
      setSavingProperty(false);
    }
  };

  const renderPhotos = useCallback(
    (value: any[], onChange: any) => {
      return (
        <HStack
          width="$full"
          justifyContent="space-between"
          alignItems="center"
          borderWidth="$1"
          rounded="$md"
          pr="$2"
          borderColor="$secondary400"
          height={HEIGHT * 0.2}
        >
          <Box width="80%" height="$full">
            <FlashList
              data={value}
              horizontal
              estimatedItemSize={HEIGHT * 0.15}
              renderItem={({ item }) => (
                <HStack
                  width="$full"
                  alignItems="flex-start"
                  height="$full"
                  p="$2"
                  pl="$0"
                >
                  <VStack width={HEIGHT * 0.2} space="sm" height="$full">
                    <Image
                      alt={item?.alt || ""}
                      style={{
                        borderRadius: 8,
                        flex: 1,
                        width: "100%"
                      }}
                      objectFit="cover"
                      source={{
                        uri: item?.uri
                          ? getPublicUrl(item?.uri as string, "properties")
                          : item
                      }}
                    />

                    {item?.uri && (
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="Enter Text here"
                          defaultValue={item?.alt}
                          value={item?.alt}
                          onChangeText={text => {
                            onChange(
                              value?.map((i: any) =>
                                i?.uri === item?.uri ? { ...i, alt: text } : i
                              )
                            );
                          }}
                        />
                      </Input>
                    )}
                  </VStack>
                  <Button
                    variant="link"
                    action="negative"
                    onPress={() => {
                      onChange(value.filter(uri => uri !== item));
                    }}
                  >
                    <ButtonIcon as={CloseIcon} pt="-$4" size="xl" />
                  </Button>
                </HStack>
              )}
            />
          </Box>
          <Menu
            selectionMode="single"
            onSelectionChange={async selectedValue => {
              const selectedAction = new Set(selectedValue).keys().next()
                .value as "gallery" | "camera";

              switch (selectedAction) {
                case "camera":
                  takeMedia({
                    type: MEDIA_TYPE.Images,
                    cameraType: CAMERA_TYPE.back
                  }).then(result => {
                    !result.canceled &&
                      onChange([
                        ...value,
                        ...result.assets.map(asset => {
                          return {
                            ...asset,
                            alt: ""
                          };
                        })
                      ]);
                  });
                  break;
                case "gallery":
                  pickMedia({
                    type: MEDIA_TYPE.Images
                  }).then(result => {
                    !result.canceled &&
                      onChange([
                        ...value,
                        ...result.assets.map(asset => {
                          return {
                            ...asset,
                            alt: ""
                          };
                        })
                      ]);
                  });
                  break;
                default:
                  return;
              }
            }}
            placement={"top"}
            height="$full"
            trigger={({ ...triggerProps }) => {
              return (
                <Button {...triggerProps} variant="outline" px="$2" size="sm">
                  <ButtonIcon size="xl" color="$primary500" as={PlusIcon} />
                </Button>
              );
            }}
          >
            <MenuItem key="camera" textValue="Camera">
              <Icon as={CameraIcon} size="sm" mr="$2" />
              <MenuItemLabel size="sm">Camera</MenuItemLabel>
            </MenuItem>
            <MenuItem key="gallery" textValue="Gallery">
              <Icon as={GalleryHorizontal} size="sm" mr="$2" />
              <MenuItemLabel size="sm">Gallery</MenuItemLabel>
            </MenuItem>
          </Menu>
        </HStack>
      );
    },
    [watch("images")]
  );

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
      rounded="$lg"
      display="flex"
      width="$full"
      p="$4"
      my="$6"
    >
      <Heading my="$2">Listing information</Heading>

      <HStack alignItems="center" width="$full" justifyContent="space-between">
        {/* Property type */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="property_type"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              isInvalid={errors.property_type?.message !== undefined}
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Property Type</FormControlLabelText>
              </FormControlLabel>

              <Select
                onValueChange={onChange}
                defaultValue={value}
                selectedValue={value}
              >
                <SelectTrigger variant="outline" size="md" onBlur={onBlur}>
                  <SelectInput placeholder="Select one" />
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
                    {propertyTypes?.data
                      ? propertyTypes?.data.map(type => (
                          <SelectItem
                            key={type.name}
                            label={capitalize(type.name)}
                            value={type.name}
                          />
                        ))
                      : null}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.property_type?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        {/* Listing type */}
        <Controller
          control={control}
          name="listing_type"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              width="48%"
              isInvalid={errors.listing_type?.message !== undefined}
            >
              <FormControlLabel>
                <FormControlLabelText>Listing Type</FormControlLabelText>
              </FormControlLabel>
              <Select
                onValueChange={onChange}
                defaultValue={value}
                selectedValue={value}
              >
                <SelectTrigger variant="outline" size="md" onBlur={onBlur}>
                  <SelectInput placeholder="Select one" />
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
                    {listingTypes?.data
                      ? listingTypes?.data.map(type => {
                          if (
                            (watch("property_type") == "warehouse" ||
                              watch("property_type") == "land") &&
                            type.name !== "rental"
                          ) {
                            return (
                              <SelectItem
                                key={type.name}
                                label={capitalize(type.name)}
                                value={type.name}
                              />
                            );
                          }
                          if (
                            watch("property_type") !== "land" &&
                            watch("property_type") !== "warehouse" &&
                            type.name !== "lease"
                          ) {
                            return (
                              <SelectItem
                                key={type.name}
                                label={capitalize(type.name)}
                                value={type.name}
                              />
                            );
                          }
                        })
                      : null}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.listing_type?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </HStack>

      <HStack alignItems="center" width="$full" justifyContent="space-between">
        {/* Bedrooms */}
        <Controller
          control={control}
          name="bedrooms"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              isInvalid={errors.bedrooms?.message !== undefined}
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Bedrooms</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  value={numberFormatter(value || 0)}
                  onChangeText={text =>
                    onChange(parseInt(text.replace(/,/g, "")))
                  }
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.bedrooms?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        {/* Bathrooms */}
        <Controller
          control={control}
          name="bathrooms"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              isInvalid={errors.bathrooms?.message !== undefined}
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Bathrooms</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  value={numberFormatter(value || 0)}
                  onChangeText={text =>
                    onChange(Number(text.replace(/,/g, "")))
                  }
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.bathrooms?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </HStack>

      <HStack alignItems="center" width="$full" justifyContent="space-between">
        {/* Price */}
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              isInvalid={errors.price?.message !== undefined}
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Price</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputSlot>
                  <InputIcon ml="$2" as={DollarSign} />
                </InputSlot>
                <InputField
                  type="text"
                  value={
                    value?.toLocaleString("en-US", { style: "decimal" }) || "0"
                  }
                  onChangeText={text =>
                    onChange(Number(text.replace(/,/g, "")))
                  }
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.price?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        {/* Property Size */}
        <Controller
          control={control}
          name="property_size"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              width="48%"
              isInvalid={errors.property_size?.message !== undefined}
            >
              <FormControlLabel>
                <FormControlLabelText>
                  Property Size (m&sup2;)
                </FormControlLabelText>
              </FormControlLabel>

              <Input>
                <InputField
                  type="text"
                  value={numberFormatter(value || 0)}
                  onChangeText={text =>
                    onChange(Number(text.replace(/,/g, "")))
                  }
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  placeholder="0"
                />
              </Input>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.property_size?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </HStack>

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            width="100%"
            isInvalid={errors.description?.message !== undefined}
            isRequired
          >
            <FormControlLabel>
              <FormControlLabelText>Description</FormControlLabelText>
            </FormControlLabel>

            <Textarea
              size="md"
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
            >
              <TextareaInput
                value={value?.toLocaleString()}
                autoCorrect
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Tell us about the property"
              />
            </Textarea>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.description?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      {/* Amenities */}
      <Controller
        control={control}
        name="amenities"
        rules={{ required: "Please select at least one amenity" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl width="100%">
            <FormControlLabel>
              <FormControlLabelText>Amenities</FormControlLabelText>
            </FormControlLabel>
            {availableAmenitiesData!?.data ? (
              <CheckboxGroup
                value={(value as string[]) ?? []}
                onChange={onChange}
              >
                <HStack flexWrap="wrap" space="md">
                  {availableAmenitiesData!?.data!?.map((amenity, i) => (
                    <Checkbox
                      key={amenity.id}
                      value={amenity.name}
                      onBlur={onBlur}
                      aria-label="Checkbox"
                    >
                      <CheckboxIndicator mr="$2">
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                      <CheckboxLabel>{amenity.name}</CheckboxLabel>
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            ) : null}
          </FormControl>
        )}
      />

      <HStack justifyContent="space-between" w="$full">
        <Controller
          control={control}
          name="date_available"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired
              isInvalid={errors.date_available?.message !== undefined}
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Date available</FormControlLabelText>
              </FormControlLabel>
              <Button
                onPress={() => setShowDatePicker(true)}
                variant="outline"
                justifyContent="flex-start"
                pl="$2"
                borderColor="$secondary400"
              >
                <ButtonText fontWeight="$normal" textAlign="left">
                  {value
                    ? dayjs(value).format("DD MMM YYYY").toString()
                    : "Select Date"}
                </ButtonText>
              </Button>
              <Modal
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                finalFocusRef={finalFocusRef}
              >
                <ModalBackdrop />
                <ModalContent>
                  <ModalHeader>
                    <Heading size="lg">Select availability date</Heading>
                    <ModalCloseButton>
                      <Icon as={CloseIcon} />
                    </ModalCloseButton>
                  </ModalHeader>
                  <ModalBody>
                    <View flex={1}>
                      <DateTimePicker
                        minDate={dayjs()}
                        mode="single"
                        displayFullDays
                        calendarTextStyle={{
                          color: colorMode === "dark" ? "white" : "black"
                        }}
                        headerTextStyle={{
                          color: colorMode === "dark" ? "white" : "black"
                        }}
                        headerButtonColor={
                          colorMode === "dark" ? "white" : "black"
                        }
                        weekDaysTextStyle={{
                          color: colorMode === "dark" ? "white" : "black"
                        }}
                        date={date}
                        onChange={date => setDate(date.date)}
                      />
                    </View>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="outline"
                      action="secondary"
                      onPress={() => setShowDatePicker(false)}
                    >
                      <ButtonText>Close</ButtonText>
                    </Button>
                    <View width="$2" />
                    <Button
                      onPress={() => {
                        onChange(dayjs(date).toDate().toISOString());
                        setShowDatePicker(false);
                      }}
                    >
                      <ButtonText>Set Date</ButtonText>
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.date_available?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        {/* Lease Duration */}
        <Controller
          control={control}
          rules={{ required: true }}
          name="lease_duration"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl
              isRequired={
                watch("listing_type") == "rental" ||
                watch("listing_type") == "lease" ||
                watch("listing_type") == null
              }
              isDisabled={
                watch("listing_type") == "sale" || watch("listing_type") == null
              }
              width="48%"
            >
              <FormControlLabel>
                <FormControlLabelText>Lease duration</FormControlLabelText>
              </FormControlLabel>

              <Select
                onValueChange={onChange}
                defaultValue={value ?? undefined}
                selectedValue={value ?? undefined}
              >
                <SelectTrigger variant="outline" size="md" onBlur={onBlur}>
                  <SelectInput placeholder="Select One" />
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
                    {leaseDurationTypes?.data
                      ? leaseDurationTypes?.data.map(type => (
                          <SelectItem
                            key={type.name}
                            label={capitalize(type.name)}
                            value={type.name}
                          />
                        ))
                      : null}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.property_type?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </HStack>

      {/* Furnished */}
      <Controller
        control={control}
        name="furnished"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl width="$1/3">
            <FormControlLabel>
              <FormControlLabelText>Furnished</FormControlLabelText>
            </FormControlLabel>

            <HStack space="md" mb="$2">
              <Switch
                defaultValue={true}
                value={value ?? false}
                onValueChange={onChange}
              />
            </HStack>
            <Text size="xs">Is the property furnished or not?</Text>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="images"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl
            width="100%"
            isRequired
            isInvalid={errors.images?.message !== undefined}
          >
            <FormControlLabel>
              <FormControlLabelText>Images</FormControlLabelText>
            </FormControlLabel>
            {(value == undefined || value.length == 0) && (
              <Center
                borderWidth="$2"
                rounded="$md"
                borderColor="$secondary300"
                height={HEIGHT * 0.2}
              >
                <Menu
                  selectionMode="single"
                  onSelectionChange={async selectValue => {
                    const selectedAction = new Set(selectValue).keys().next()
                      .value as "gallery" | "camera";

                    switch (selectedAction) {
                      case "camera":
                        takeMedia({
                          type: MEDIA_TYPE.Images,
                          cameraType: CAMERA_TYPE.back
                        }).then(result => {
                          !result.canceled &&
                            onChange([
                              ...value,
                              ...result.assets.map(asset => {
                                return {
                                  ...asset,
                                  alt: ""
                                };
                              })
                            ]);
                        });
                        break;
                      case "gallery":
                        pickMedia({
                          type: MEDIA_TYPE.Images
                        }).then(result => {
                          !result.canceled &&
                            onChange([
                              ...value,
                              ...result.assets.map(asset => {
                                return {
                                  ...asset,
                                  alt: ""
                                };
                              })
                            ]);
                        });
                        break;
                      default:
                        return;
                    }
                  }}
                  placement={"top"}
                  height="$full"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button {...triggerProps}>
                        <ButtonIcon as={PlusIcon} mr="$2" />
                        <ButtonText>Add Photos</ButtonText>
                      </Button>
                    );
                  }}
                >
                  <MenuItem key="camera" textValue="Camera">
                    <Icon as={CameraIcon} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">Camera</MenuItemLabel>
                  </MenuItem>
                  <MenuItem key="gallery" textValue="Gallery">
                    <Icon as={GalleryHorizontal} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">Gallery</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </Center>
            )}
            {value !== undefined &&
              value?.length > 0 &&
              renderPhotos(value, onChange)}

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.images?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="video_tour"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl width="100%" position="relative">
            <FormControlLabel>
              <FormControlLabelText>Virtual tour</FormControlLabelText>
            </FormControlLabel>
            {(value == undefined || value == "") && (
              <Center
                borderWidth="$1"
                rounded="$md"
                borderColor="$secondary400"
                height={HEIGHT * 0.15}
              >
                <Menu
                  placement={"top"}
                  height="$full"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button {...triggerProps}>
                        <ButtonIcon as={PlusIcon} mr="$2" />
                        <ButtonText>Add Video</ButtonText>
                      </Button>
                    );
                  }}
                >
                  <MenuItem
                    key="camera"
                    textValue="Camera"
                    onPress={() =>
                      takeMedia({
                        type: MEDIA_TYPE.Videos,
                        cameraType: CAMERA_TYPE.back
                      }).then(result => {
                        !result.canceled && onChange(result.assets[0]);
                        console.log(result);
                      })
                    }
                  >
                    <Icon as={CameraIcon} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">Camera</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="gallery"
                    textValue="Gallery"
                    onPress={() =>
                      pickMedia({
                        type: MEDIA_TYPE.Videos
                      }).then(result => {
                        !result.canceled && onChange(result.assets[0]);
                        console.log(result);
                      })
                    }
                  >
                    <Icon as={GalleryHorizontal} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">Gallery</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </Center>
            )}

            {value && value !== "" && value !== undefined && (
              <View position="relative" width="100%" height={HEIGHT * 0.15}>
                <Video
                  ref={videoRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: "#737373"
                  }}
                  source={{
                    uri: getPublicUrl(
                      (value?.uri as string) ?? "",
                      "properties"
                    )
                  }}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  // onPlaybackStatusUpdate={(status) =>
                  //   setVideoStatus(() => status.)
                  // }
                />
                <HStack
                  position="absolute"
                  top="35%"
                  left="35%"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="$4"
                  rounded="$xl"
                  bg="$secondary400"
                  px="$4"
                >
                  <Button
                    variant="link"
                    onPress={() => videoRef.current?.presentFullscreenPlayer()}
                  >
                    <ButtonIcon color="$white" size="xl" as={PlayIcon} />
                  </Button>
                  <Button variant="link" onPress={() => onChange("")}>
                    <ButtonIcon color="$white" size="xl" as={TrashIcon} />
                  </Button>
                </HStack>
              </View>
            )}

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Mandatory field</FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />

      <HStack my="$2" width="$full" justifyContent="flex-end">
        <Button
          width="$full"
          isDisabled={savingProperty}
          onPress={handleSubmit(onSubmit)}
        >
          {savingProperty && <ButtonSpinner mr="$2" />}
          <ButtonText>Save Property</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
}
