import {
  addToFavorites,
  deleteProperty,
  findFavourite,
  removeFromFavorites,
  updatePropertyStatus
} from "@/lib/data/property";
import { getPublicUrl } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { nFormatter } from "@/lib/utils/nFormatter";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { AntDesign } from "@expo/vector-icons";
import {
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  CloseIcon,
  Divider,
  EditIcon,
  Heading,
  HStack,
  Icon,
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
  Pressable,
  Spinner,
  Text,
  TrashIcon,
  View,
  VStack
} from "@gluestack-ui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { capitalize } from "lodash";
import {
  Bath,
  BedDouble,
  CheckCircle2Icon,
  MoreVerticalIcon,
  Scaling
} from "lucide-react-native";
import { memo, useEffect, useRef, useState } from "react";
import Animated, { useSharedValue } from "react-native-reanimated";

export default function PropertyCard({ property, isDashboard }: any) {
  const { session } = useSession();
  const myValue = useSharedValue(0);

  const queryClient = useQueryClient();
  const lastItemId = useRef(property.id);
  if (property.id !== lastItemId.current) {
    lastItemId.current = property.id;
  }
  const router = useRouter();
  const ref = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const { data: favouriteData, refetch: refetchFavourites } = useQuery({
    queryKey: ["favourites", property?.id],
    staleTime: 500,
    queryFn: () => findFavourite({ id: property?.id, session: session! }),
    enabled: !!property?.id && !!session?.user.id
  });

  const { mutateAsync: addToFavoritesMutation, isPending: isAdding } =
    useMutation({
      mutationFn: addToFavorites,
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: ["favourites", property?.id]
        });
        queryClient.invalidateQueries({
          queryKey: ["favourites", session?.user.id]
        });
        refetchFavourites();
        toast("Property saved", {
          duration: 2000,
          position: ToastPosition.BOTTOM,
          icon: "👍"
        });
      }
    });

  const { mutateAsync: removeFromFavouritesMutation } = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["favourites", property?.id]
      });
      queryClient.invalidateQueries({
        queryKey: ["favourites", session?.user.id]
      });
      refetchFavourites();

      toast("Property removed from saved", {
        duration: 2000,
        position: ToastPosition.BOTTOM
      });
    }
  });

  const { mutate: deletePropertyMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: () => deleteProperty(property?.id),
      onSuccess: async () => {
        setShowDeletionModal(false);
        queryClient.invalidateQueries({
          queryKey: ["properties", session?.user?.id]
        });
      }
    }
  );

  const { mutate: updatePropertyStatusMutation } = useMutation({
    mutationFn: updatePropertyStatus,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", session?.user.id]
      });
      toast("Property status updated", {
        duration: 2000,
        position: ToastPosition.BOTTOM
      });
    }
  });

  const leaseDuration: Record<string, string> = {
    month: "m",
    "6 months": "6 mths",
    year: "year",
    "2 years": "2 yrs",
    "more than 2 years": "2 yrs+"
  };

  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    myValue.value = 0;
  }, [property.id, myValue]);

  const MemoisedImage = memo(() => (
    <Image
      priority="high"
      cachePolicy="memory-disk"
      contentFit="cover"
      onLoadEnd={() => setImageLoaded(true)}
      alt="Property photo"
      style={{
        width: "100%",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        opacity: property.status != "available" ? 0.5 : 1,
        height: "100%"
      }}
      source={getPublicUrl(
        (property.images[0].uri as string) || (property.images[0] as string),
        "properties"
      )}
    />
  ));

  return (
    <Animated.View>
      <Box
        height={HEIGHT * 0.4}
        sx={{
          _dark: {
            backgroundColor: "$secondary800"
          },
          _light: {
            backgroundColor: "$white"
          }
        }}
        rounded="$lg"
        width="$full"
        ml="$1"
      >
        <View width="$full" justifyContent="space-between" height="$full">
          {/* Property photo */}
          {/* @ts-ignore */}
          <Link asChild href={`/property/${property.id as string}`}>
            <Pressable height="55%">
              <View
                width="$full"
                justifyContent="center"
                alignItems="center"
                position="relative"
                height="$full"
              >
                {property.images[0] ? (
                  <Center width="$full" position="relative" height="$full">
                    <MemoisedImage />
                    {!imageLoaded ? (
                      <Spinner position="absolute" top="$1/2" left="45%" />
                    ) : null}
                  </Center>
                ) : null}
                {property.status != "available" ? (
                  <Center
                    width="$full"
                    position="absolute"
                    borderTopRightRadius="$lg"
                    borderTopLeftRadius="$lg"
                    height="$full"
                  >
                    <Badge
                      variant="solid"
                      borderRadius="$lg"
                      justifyContent="center"
                      action="muted"
                    >
                      <BadgeText>unavailable</BadgeText>
                    </Badge>
                  </Center>
                ) : null}
              </View>
            </Pressable>
          </Link>

          <VStack
            p="$2"
            flex={1}
            borderBottomRightRadius="$lg"
            borderBottomLeftRadius="$lg"
            justifyContent="space-between"
          >
            {/* Price, listing type and like button */}
            <HStack
              width="$full"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack alignItems="flex-end">
                <Text semibold fontSize="$lg">
                  ${nFormatter(property.price, 0).toLocaleString()}
                </Text>
                {property.lease_duration ? (
                  <Text fontSize="$xs">
                    /{leaseDuration[property.lease_duration as string]}
                  </Text>
                ) : null}
              </HStack>

              {isDashboard ? (
                <Menu
                  placement="bottom"
                  closeOnSelect
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button variant="link" height="$4" {...triggerProps}>
                        <ButtonIcon size="xl" as={MoreVerticalIcon} />
                      </Button>
                    );
                  }}
                >
                  <MenuItem
                    key="edit"
                    textValue="Edit"
                    onPress={() =>
                      router.push({
                        pathname: "/(drawer)/(properties)/edit",
                        params: { id: property.id }
                      })
                    }
                  >
                    <Icon as={EditIcon} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">Edit</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="setToAvailable"
                    textValue="Set to available"
                    onPress={() =>
                      updatePropertyStatusMutation({
                        id: property.id,
                        status:
                          property.status === "available"
                            ? "unavailable"
                            : "available"
                      })
                    }
                  >
                    <Icon as={CheckCircle2Icon} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">
                      Set to{" "}
                      {property.status == "available"
                        ? "unavailable"
                        : "available"}
                    </MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="delete"
                    textValue="Delete"
                    onPress={() => setShowDeletionModal(true)}
                  >
                    <Icon as={TrashIcon} color="$error600" size="sm" mr="$2" />
                    <MenuItemLabel size="sm" color="$error600">
                      Delete
                    </MenuItemLabel>
                  </MenuItem>
                </Menu>
              ) : (
                <Pressable
                  display={session ? "flex" : "none"}
                  disabled={isAdding || isDeleting}
                  onPress={async () => {
                    if (favouriteData?.data?.property_id !== property.id) {
                      await addToFavoritesMutation({
                        id: property.id,
                        session: session!
                      });
                      return;
                    }
                    await removeFromFavouritesMutation({
                      id: property.id
                    });
                  }}
                >
                  {property.user_id == session?.user.id ? (
                    <Badge>
                      <BadgeText>Yours</BadgeText>
                    </Badge>
                  ) : property.user_id !== session?.user.id &&
                    favouriteData?.data?.property_id !== property.id ? (
                    <AntDesign size={24} name="hearto" color="#0e96f8" />
                  ) : (
                    <AntDesign size={24} name="heart" color="#0e96f8" />
                  )}
                </Pressable>
              )}
            </HStack>
            {/* City */}
            <Text fontSize="$md" numberOfLines={1} fontWeight="$semibold">
              {property.city ?? ""}
            </Text>
            {/* Address */}
            <Text
              fontSize="$xs"
              numberOfLines={1}
              ellipsizeMode="tail"
              fontWeight="$medium"
            >
              {property.community} ,{property.address}
            </Text>
            <Divider my="$2" />
            {/* Features */}
            <HStack space="lg" maxWidth="$full" h="$7">
              {property.bedrooms > 1 ? (
                <HStack alignItems="center">
                  <Icon as={BedDouble} color="#a3a3a3" />
                  {property.bedrooms > 0 ? (
                    <Text fontSize="$xs">{property.bedrooms}</Text>
                  ) : null}
                </HStack>
              ) : null}
              {property.bathrooms > 1 ? (
                <HStack alignItems="center">
                  <Icon as={Bath} color="#a3a3a3" />
                  {property.bathrooms > 0 ? (
                    <Text fontSize="$xs">{property.bathrooms}</Text>
                  ) : null}
                </HStack>
              ) : null}
              {property.property_size ? (
                <HStack alignItems="center">
                  <Icon as={Scaling} color="#a3a3a3" />
                  {property.property_size ? (
                    <Text fontSize="$xs">{`${nFormatter(property.property_size).toLocaleString()}m\u00B2`}</Text>
                  ) : null}
                </HStack>
              ) : null}
            </HStack>

            <VStack>
              <HStack alignItems="center" justifyContent="flex-end">
                <Badge
                  variant="solid"
                  borderRadius="$lg"
                  justifyContent="center"
                  action="info"
                >
                  <BadgeText>{capitalize(property.property_type)}</BadgeText>
                </Badge>
              </HStack>
            </VStack>
          </VStack>
        </View>
        <Modal
          isOpen={showDeletionModal}
          onClose={() => {
            setShowDeletionModal(false);
          }}
          finalFocusRef={ref}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text fontFamily="NotoSans_700Bold" fontSize="$xl">
                Delete this property?
              </Text>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>
                You're about to delete the {property?.property_type} at{" "}
                {property?.address}, {property?.community}, {property?.city}.
                This action cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowDeletionModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="negative"
                onPress={() => {
                  deletePropertyMutation();
                }}
              >
                <ButtonText>Proceed</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Animated.View>
  );
}
