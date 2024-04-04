import { createChatToken, findChatChannel } from "@/lib/data/chat";
import { getProfileById } from "@/lib/data/profile";
import {
  addToFavorites,
  findFavourite,
  getPropertyById,
  removeFromFavorites
} from "@/lib/data/property";
import { getStreamChatClient } from "@/lib/helpers/getstream";
import { getPublicUrl } from "@/lib/helpers/supabase";
import { useRefreshOnFocus } from "@/lib/hooks/use-refresh-on-focus";
import { useChatProviderContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { HEIGHT, WIDTH } from "@/lib/utils/constants";
import { nFormatter } from "@/lib/utils/nFormatter";
import { BookmarkIcon } from "@/modules/common/icons/bookmark/bookmark";
import { PhotosIcon } from "@/modules/common/icons/photos";
import { SendIcon } from "@/modules/common/icons/send/send";
import { Screen } from "@/modules/common/ui/screen";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import ReadMore from "@fawazahmed/react-native-read-more";
import {
  ArrowRightIcon,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  CloseIcon,
  HStack,
  Pressable,
  ScrollView,
  ShareIcon,
  Spinner,
  Text,
  useColorMode,
  View,
  VStack
} from "@gluestack-ui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { capitalize, property } from "lodash";
import { useRef, useState } from "react";
import { Alert, Modal, Platform, Share } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { createOpenLink } from "react-native-open-maps";
import PagerView from "react-native-pager-view";
import { useChatContext } from "stream-chat-expo";
import VideoModal from "../components/video-modal";

export default function PropertyDetailsScreen() {
  const { session } = useSession();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [photosModal, setPhotosModal] = useState(false);
  const colorMode = useColorMode();
  const { setChannel } = useChatProviderContext();
  const { client } = useChatContext();

  const { data: propertyData, isPending } = useQuery({
    queryKey: [id],
    queryFn: () => getPropertyById({ id: parseInt(id as string) })
  });

  const features = [
    {
      label: "Listed",
      value: propertyData?.data?.created_at
        ? formatDistanceToNow(new Date(propertyData?.data?.created_at as any), {
            addSuffix: true
          })
        : "N/A"
    },
    {
      label: "Date Available",
      value:
        propertyData?.data?.date_available &&
        propertyData.data.status === "available"
          ? formatDistanceToNow(
              new Date(propertyData?.data?.date_available as any),
              {
                addSuffix: true
              }
            )
          : "N/A"
    },
    {
      label: "Property Type",
      value: capitalize(propertyData?.data?.property_type)
    },
    {
      label: "Deposit",
      value: propertyData?.data?.deposit
        ? `$${propertyData?.data?.deposit?.toLocaleString()}`
        : "N/A"
    }
  ];
  const { mutate: addToFavoritesMutation } = useMutation({
    mutationFn: addToFavorites,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["favourites", id]
      });
      toast("Property saved", {
        duration: 2000,
        position: ToastPosition.BOTTOM,
        icon: "👍"
      });
    }
  });
  const { mutate: removeFromFavouritesMutation } = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["property", id]
      });
      queryClient.invalidateQueries({
        queryKey: ["favourites", id]
      });
      queryClient.invalidateQueries({
        queryKey: ["favourites", session?.user.id]
      });
      toast("Property removed from saved", {
        duration: 2000,
        position: ToastPosition.BOTTOM
      });
    }
  });
  const { data: favouriteData } = useQuery({
    queryKey: ["favourites", id],
    staleTime: 500,
    queryFn: () =>
      findFavourite({ id: parseInt(id as string), session: session! })
  });

  const { data: propertyOwner } = useQuery({
    queryKey: ["profile", propertyData?.data?.user_id],
    queryFn: () => getProfileById({ id: propertyData?.data?.user_id! })
  });

  const filter = {
    type: "messaging",
    members: {
      $in: [session?.user.id!]
    }
  };
  const sort: any = [{ last_message_at: -1 }];
  const {
    data: chatData,
    isPending: checkingForChat,
    refetch
  } = useQuery({
    queryKey: ["chat data", propertyOwner?.data?.id],
    staleTime: 300,
    queryFn: () =>
      getStreamChatClient.queryChannels(filter, sort, {
        watch: true, // this is the default
        state: true
      }),
    enabled: !!session
  });
  const foundChannel =
    chatData?.map(
      channel => channel.state.members[propertyOwner?.data?.id ?? ""]
    ) || [];
  const onShare = async () => {
    try {
      const result = await Share.share(
        Platform.OS === "android"
          ? {
              message: `https://fenamnow.com/property/${id}`
            }
          : {
              url: `https://fenamnow.com/property/${id}`
            },
        {
          subject: `${propertyData?.data?.community}, ${propertyData?.data?.address} | Fenamnow`
        }
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          toast("Property shared");
        } else {
          return;
        }
      } else if (result.action === Share.dismissedAction) {
        return;
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  if (isPending) {
    return (
      <Screen
        edges={["bottom"]}
        justifyContent="center"
        gap="$4"
        alignItems="center"
      >
        <Text fontSize="$lg" semibold>
          Loading property
        </Text>
        <Spinner size="large" />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen
        listeners={{
          beforeRemove: () => {
            queryClient.invalidateQueries({
              queryKey: ["chat", id]
            });
          }
        }}
        // name="property/[id]"
        options={{
          headerTitle: "Property Details"
        }}
      />
      <Screen edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false} height="$full">
          {/* Address and actions */}
          <HStack
            height={HEIGHT * 0.12}
            alignItems="flex-end"
            justifyContent="space-between"
            gap="$4"
            my="$4"
          >
            <VStack
              maxWidth="$1/2"
              height="$full"
              space="md"
              justifyContent="space-between"
            >
              <View>
                <Text fontSize="$xl" bold>
                  {propertyData?.data?.city}
                </Text>
                <Text semibold>
                  {propertyData?.data?.community},{propertyData?.data?.address}
                </Text>
              </View>
              <HStack>
                <Text semibold fontSize="$xl">
                  ${propertyData?.data?.price.toLocaleString()}
                  {propertyData?.data?.lease_duration ? (
                    <Text fontWeight="$normal">
                      /{propertyData?.data?.lease_duration as string}
                    </Text>
                  ) : null}
                </Text>
              </HStack>
            </VStack>
            <VStack
              maxWidth="$1/2"
              height="$full"
              alignContent="flex-end"
              justifyContent="space-between"
            >
              <HStack>
                <Badge variant="outline" action="info">
                  <BadgeText>{propertyData?.data?.property_type}</BadgeText>
                </Badge>
              </HStack>
              <HStack space="md">
                <Button size="sm" px="$3" variant="outline" onPress={onShare}>
                  <ButtonIcon size="xl" color="$primary500" as={ShareIcon} />
                </Button>

                <Button
                  size="sm"
                  display={session ? "flex" : "none"}
                  isDisabled={propertyOwner?.data?.id == session?.user.id}
                  px="$3"
                  variant={
                    favouriteData?.data?.property_id == parseInt(id as string)
                      ? "solid"
                      : "outline"
                  }
                  onPress={() => {
                    favouriteData?.data?.property_id == parseInt(id as string)
                      ? removeFromFavouritesMutation({
                          id: parseInt(id as string)
                        })
                      : addToFavoritesMutation({
                          id: parseInt(id as string),
                          session: session!
                        });
                  }}
                >
                  <ButtonIcon
                    px="$3"
                    size="xl"
                    color={
                      favouriteData?.data?.property_id == parseInt(id as string)
                        ? "$white"
                        : "$primary500"
                    }
                    as={BookmarkIcon}
                  />
                </Button>
              </HStack>
            </VStack>
          </HStack>
          {/* Photos */}
          <HStack
            height={HEIGHT * 0.3}
            justifyContent="space-between"
            width="$full"
            my="$4"
          >
            {/* First Photo */}
            <Box height="$full" rounded="$lg" position="relative" width="60%">
              <Image
                priority="high"
                cachePolicy="memory-disk"
                contentFit="cover"
                style={{ width: "100%", borderRadius: 6, height: "100%" }}
                source={{
                  uri: getPublicUrl(
                    // @ts-expect-error
                    (propertyData?.data?.images[0]?.uri as string) ||
                      (propertyData?.data?.images[0] as string),
                    "properties"
                  )
                }}
                // @ts-expect-error
                alt={propertyData?.data?.images[0]?.alt || ""}
              />
              <Button
                position="absolute"
                bottom="$2.5"
                left="$2.5"
                onPress={() => setPhotosModal(true)}
              >
                <ButtonIcon as={PhotosIcon} mr="$2" />
                <ButtonText>View Photos</ButtonText>
              </Button>
            </Box>
            <VStack
              width="40%"
              alignItems="flex-end"
              justifyContent="space-between"
              height="$full"
            >
              {/* Second Photo */}
              <Image
                contentFit="cover"
                priority="high"
                cachePolicy="memory-disk"
                style={{ width: "80%", borderRadius: 6, height: "40%" }}
                source={{
                  uri: getPublicUrl(
                    // @ts-expect-error
                    (propertyData?.data?.images[1]?.uri as string) ||
                      (propertyData?.data?.images[1] as string),
                    "properties"
                  )
                }}
                // @ts-expect-error
                alt={propertyData?.data?.images[1]?.alt || ""}
              />
              {/* Third Photo */}
              <Image
                priority="high"
                cachePolicy="memory-disk"
                contentFit="cover"
                style={{ width: "80%", borderRadius: 6, height: "40%" }}
                source={{
                  uri: getPublicUrl(
                    // @ts-expect-error
                    (propertyData?.data?.images[2]?.uri as string) ||
                      (propertyData?.data?.images[2] as string),
                    "properties"
                  )
                }}
                // @ts-expect-error
                alt={propertyData?.data?.images[2]?.alt || ""}
              />
            </VStack>
          </HStack>
          {/* Specifications */}
          <View my="$4">
            <Text semibold fontSize="$xl">
              Specifications
            </Text>
            <VStack
              width="$full"
              minHeight={HEIGHT * 0.1}
              sx={{
                _dark: {
                  backgroundColor: "#262626"
                },
                _light: {
                  backgroundColor: "#ffffff"
                }
              }}
              justifyContent="center"
              rounded="$lg"
              p="$4"
              gap="$4"
              my="$2"
            >
              {/* beds, baths, size */}
              <HStack justifyContent="space-between">
                {/* Beds */}
                <VStack width="30%">
                  <Text semibold>Beds</Text>
                  <Text fontWeight="$semibold">
                    {propertyData?.data?.bedrooms.toLocaleString("en-GB")}
                  </Text>
                </VStack>
                {/* Baths */}
                <VStack width="30%">
                  <Text semibold>Baths</Text>
                  <Text fontWeight="$semibold">
                    {propertyData?.data?.bathrooms.toLocaleString("en-GB")}
                  </Text>
                </VStack>
                {/* Size */}
                <VStack width="30%">
                  <Text semibold>Size</Text>
                  <Text>
                    {propertyData?.data?.property_size
                      ? `${nFormatter(propertyData?.data?.property_size as number)?.toLocaleString()}m\u00B2`
                      : "N/A"}
                  </Text>
                </VStack>
              </HStack>
              {/* Status, Furnished, Lot size */}
              <HStack justifyContent="space-between">
                {/* Status */}
                <VStack width="30%">
                  <Text semibold>Available?</Text>
                  <Text fontWeight="$semibold">
                    {propertyData?.data?.status == "available" ? "Yes" : "No"}
                  </Text>
                </VStack>
                {/* Furnished */}
                <VStack width="30%">
                  <Text semibold>Furnished?</Text>
                  <Text fontWeight="$semibold">
                    {propertyData?.data?.furnished ? "Yes" : "No"}
                  </Text>
                </VStack>
                {/* Lot size */}
                <VStack width="30%">
                  <Text semibold>Negotiable?</Text>
                  <Text fontWeight="$semibold">
                    {propertyData?.data?.negotiable ? "Yes" : "No"}
                  </Text>
                </VStack>
              </HStack>
              <HStack></HStack>
            </VStack>
          </View>
          {/* Description */}
          <View my="$2">
            <Text semibold fontSize="$xl">
              Description
            </Text>
            <ReadMore
              seeMoreStyle={{
                color: "#0d89bc",
                fontWeight: "bold"
              }}
              seeLessStyle={{
                color: "#0d89bc",
                fontWeight: "bold"
              }}
              numberOfLines={5}
              style={{
                fontSize: 16,
                fontFamily: "NotoSans_400Regular",
                color: colorMode == "dark" ? "#fff" : "#000"
              }}
            >
              {propertyData?.data?.description}
            </ReadMore>
          </View>
          {/* Lister details */}

          <View my="$2">
            <Text semibold fontSize="$xl">
              Listed by
            </Text>
            <HStack
              width="$full"
              height={HEIGHT * 0.2}
              sx={{
                _dark: {
                  backgroundColor: "#262626"
                },
                _light: {
                  backgroundColor: "#ffffff"
                }
              }}
              rounded="$lg"
              justifyContent="space-between"
              my="$2"
              p="$4"
            >
              <VStack width="$full" justifyContent="space-between">
                {/* Agent details */}
                <HStack alignItems="center">
                  <Avatar
                    bgColor="$amber600"
                    mr="$2"
                    size="md"
                    borderRadius="$full"
                  >
                    <AvatarFallbackText>
                      {/* @ts-ignore */}
                      {propertyData?.data?.user_id?.full_name}
                    </AvatarFallbackText>
                    {/* @ts-ignore */}
                    {propertyData?.data?.user_id?.avatar_url ? (
                      <AvatarImage
                        source={{
                          uri: getPublicUrl(
                            // @ts-ignore
                            propertyOwner?.data?.avatar_url,
                            "avatars"
                          )
                        }}
                        alt={propertyOwner?.data?.full_name || ""}
                      />
                    ) : null}
                  </Avatar>
                  <VStack>
                    <Text semibold fontSize="$lg">
                      {/* @ts-ignore */}
                      {propertyOwner?.data?.full_name}
                    </Text>
                    <Text fontSize="$sm" opacity="$60" semibold>
                      {/* @ts-ignore */}
                      {capitalize(propertyOwner?.data?.type)}
                    </Text>
                  </VStack>
                </HStack>
                {/* Actions */}
                <HStack width="$full" justifyContent="space-between">
                  <VideoModal
                    // @ts-ignore
                    isDisabled={!propertyData?.data?.video_tour?.uri}
                    // @ts-ignore
                    uri={propertyData?.data?.video_tour?.uri}
                  />

                  {session && propertyOwner?.data?.id !== session.user.id && (
                    <Button
                      width="50%"
                      isDisabled={checkingForChat}
                      onPress={async () => {
                        const channel = client.channel("messaging", {
                          members: [
                            propertyOwner?.data?.id as string,
                            session?.user.id!
                          ]
                        });
                        await channel.watch().catch(e => {
                          console.log(e);
                        });
                        // @ts-ignore
                        setChannel(channel);
                        router.navigate(`/chat/${channel?.cid}`);
                      }}
                    >
                      <ButtonIcon
                        mr="$1"
                        size="xl"
                        fontWeight="$medium"
                        as={SendIcon}
                      />
                      <ButtonText fontSize="$sm">
                        {foundChannel && foundChannel?.length > 0
                          ? "Continue Chat"
                          : "Send a message"}
                      </ButtonText>
                    </Button>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </View>
          {/* Features */}
          <VStack maxHeight={HEIGHT * 0.35} my="$4" width="$full">
            <Text semibold fontSize="$xl">
              Features
            </Text>
            <VStack
              width="$full"
              minHeight={HEIGHT * 0.1}
              sx={{
                _dark: {
                  backgroundColor: "#262626"
                },
                _light: {
                  backgroundColor: "#ffffff"
                }
              }}
              justifyContent="center"
              rounded="$lg"
              p="$4"
              gap="$4"
            >
              {features.map((feature, index) => (
                <HStack
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text semibold>{feature.label}</Text>
                  <Text textTransform="capitalize" fontWeight="$semibold">
                    {feature.value}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
          {/* Map */}
          <VStack height={HEIGHT * 0.35} my="$4" width="$full">
            <Text semibold fontSize="$xl">
              Location
            </Text>
            <View
              width="$full"
              height="80%"
              justifyContent="space-between"
              rounded="$lg"
              alignContent="flex-start"
            >
              {propertyData?.data?.latitude && propertyData?.data?.longitude ? (
                <MapView
                  loadingEnabled
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: propertyData?.data?.latitude!,
                    longitude: propertyData?.data?.longitude!,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                  }}
                  style={{
                    width: "100%",
                    height: "100%"
                  }}
                  scrollEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: propertyData?.data?.latitude!,
                      longitude: propertyData?.data?.longitude!
                    }}
                  />
                </MapView>
              ) : (
                <Center
                  sx={{
                    _dark: {
                      backgroundColor: "#262626"
                    },
                    _light: {
                      backgroundColor: "#ffffff"
                    }
                  }}
                  height="100%"
                  width="100%"
                  rounded="$lg"
                >
                  <Text>No location provided</Text>
                </Center>
              )}
              {propertyData?.data?.latitude &&
                propertyData?.data?.longitude && (
                  <Button
                    position="absolute"
                    bottom={"$2"}
                    right={"$2"}
                    onPress={() => {
                      createOpenLink({
                        latitude: propertyData?.data?.latitude!,
                        longitude: propertyData?.data?.longitude!
                      })();
                    }}
                  >
                    <ButtonText>Open in Google Maps</ButtonText>
                  </Button>
                )}
            </View>
            <HStack>
              <Button
                variant="link"
                onPress={() =>
                  router.push({
                    pathname: "/search",
                    params: { city: propertyData?.data?.city as string }
                  })
                }
              >
                <ButtonText fontSize="$sm">
                  See more listings in {propertyData?.data?.city}
                </ButtonText>
                <ButtonIcon as={ArrowRightIcon} />
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
        {/* Photos Modal */}
        <Modal
          animationType="slide"
          visible={photosModal}
          transparent
          onRequestClose={() => {
            setPhotosModal(!photosModal);
          }}
        >
          <View
            style={{ flex: 1 }}
            pt={HEIGHT * 0.075}
            backgroundColor="$black"
          >
            <HStack>
              <Button variant="link" onPress={() => setPhotosModal(false)}>
                <ButtonIcon
                  size="xl"
                  ml={WIDTH * 0.08}
                  as={CloseIcon}
                  color="$white"
                />
              </Button>
            </HStack>
            <PagerView style={{ flex: 1 }} initialPage={0}>
              {propertyData?.data?.images.map((image: any, i) => (
                <VStack
                  justifyContent="center"
                  alignItems="center"
                  flex={1}
                  width="$full"
                  height="90%"
                  key={i}
                >
                  <Image
                    alt={image.alt || ""}
                    contentFit="contain"
                    placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
                    priority="high"
                    style={{ height: "100%", width: "100%" }}
                    cachePolicy="memory-disk"
                    source={{
                      uri: getPublicUrl(
                        (image.uri as string) || image,
                        "properties"
                      )
                    }}
                  />
                  {image.alt ? (
                    <Badge
                      size="md"
                      variant="solid"
                      borderRadius="$lg"
                      action="info"
                    >
                      <BadgeText>{image.alt}</BadgeText>
                    </Badge>
                  ) : null}
                </VStack>
              ))}
            </PagerView>
          </View>
        </Modal>
      </Screen>
    </>
  );
}
