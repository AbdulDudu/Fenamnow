import {
  blockChat,
  blockUser,
  fetchMessages,
  findChatUserIds,
  sendMessage,
  setMessagesToSeen
} from "@/lib/data/chat";
import { getPublicUrl, supabase } from "@/lib/helpers/supabase";
import { useFocusNotifyOnChangeProps } from "@/lib/hooks/use-notify-on-change-props";
import { useSession } from "@/lib/providers/session";
import { CAMERA_TYPE, HEIGHT, MEDIA_TYPE } from "@/lib/utils/constants";
import { containsWhiteSpace } from "@/lib/utils/contains-whitespace";
import {
  pickDocument,
  pickMedia,
  takeMedia,
  upload,
  uploadAudio
} from "@/lib/utils/files";
import { PhotosIcon } from "@/modules/common/icons/photos";
import { AnimatedView, BlinkingView } from "@/modules/common/ui/animated-view";
import { Screen } from "@/modules/common/ui/screen";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  Center,
  CloseIcon,
  Heading,
  HStack,
  Icon,
  InfoIcon,
  KeyboardAvoidingView,
  Menu,
  MenuItem,
  MenuItemLabel,
  Spinner,
  Text,
  Textarea,
  TextareaInput,
  View,
  VStack
} from "@gluestack-ui/themed";
import { Motion } from "@legendapp/motion";
import { FlashList, useBlankAreaTracker } from "@shopify/flash-list";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { truncate } from "lodash";
import {
  ArrowLeft,
  CameraIcon,
  FileIcon,
  MapPin,
  MicIcon,
  PlusIcon,
  SendIcon,
  ShieldBan
} from "lucide-react-native";
import { nanoid } from "nanoid";
import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { FlatList, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Animated from "react-native-reanimated";
import { useCountdown } from "usehooks-ts";
import LocationSheet from "../components/location-sheet";
import MessageBubble, { Message } from "../components/message-bubble";

function ChatRoomScreen() {
  const { id } = useGlobalSearchParams();
  const { session } = useSession();
  const { full_name, avatar_url } = useGlobalSearchParams<{
    full_name: string;
    avatar_url?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  const flashListRef = useRef<FlashList<any>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blockUserModal, setBlockUserModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [yOffset, setYOffset] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>();
  const [isRecording, setIsRecording] = useState(false);

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [showRecording, setShowRecording] = useState(false);
  const [openLocationSheet, setOpenLocationSheet] = useState(false);
  const {
    data: chatIds,
    isPending: chatIsPending,
    error: chatError
  } = useQuery({
    queryKey: ["chat", id],
    staleTime: Infinity,
    networkMode: "offlineFirst",
    retryDelay: 5000,
    queryFn: () => findChatUserIds(id as string)
  });

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 0,
      countStop: 60,
      isIncrement: true,
      intervalMs: 1000
    });

  const handleLocationSheetClose = () => {
    setOpenLocationSheet(false);
  };
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        status => {
          console.log(status);
        }
      );
      startCountdown();
      setIsRecording(true);
      setRecording(recording);
    } catch (error) {}
  };

  // const lockRecording = () => {
  // console.log("Locked recording");
  // };
  const stopRecording = async () => {
    // console.log("Recording stopped");
    stopCountdown();
    setIsRecording(false);
    resetCountdown();
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false
    });
    const uri = recording?.getURI();
    // console.log("Recording stopped and stored at", uri);
    const audioUploadPromise = uploadAudio({
      path: `/${id}/audio/${nanoid()}`,
      bucket: "chat",
      fileUri: uri!
    });

    toast
      .promise(audioUploadPromise, {
        loading: "Uploading audio",
        success: "Audio uploaded",
        error: "Error uploading audio"
      })
      .then(async uploadedAudio => {
        // console.log(uploadedAudio);
        await sendMessage({
          chat_id: id as string,
          content_type: "audio",
          sender_id: session?.user.id!,
          text: uploadedAudio?.path!
        });
      });

    setRecording(null);
  };

  const {
    data: messagesPages,
    error,
    isPending: messagesPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchMessages({ chat_id: id as string }),
    refetchInterval: 1000,
    staleTime: Infinity,
    networkMode: "offlineFirst",
    initialPageParam: true,
    getNextPageParam: lastPage => lastPage.hasNextPage,
    notifyOnChangeProps
  });

  const { mutateAsync: blockChatMutation } = useMutation({
    mutationKey: ["block chat", id],
    mutationFn: blockChat,
    onSuccess: data => {
      console.log(data);
      setBlockUserModal(false);
    }
  });

  const { mutateAsync: blockUserMutation } = useMutation({
    mutationKey: ["block user", full_name],
    mutationFn: blockUser,
    onSuccess: data => {
      console.log(data);
      setBlockingUser(false);
      toast("User blocked successfully", {
        position: ToastPosition.BOTTOM
      });
      data &&
        blockChatMutation({
          chat_id: id as string,
          user_id: data!?.data!?.blocked_id!
        });
      queryClient.invalidateQueries({
        queryKey: ["messages", id]
      });

      queryClient.invalidateQueries({
        queryKey: ["chats", session?.user.id]
      });

      router.replace("../");
    }
  });

  useEffect(() => {
    if (messagesPages) {
      const allMessages = messagesPages.pages.flatMap(
        page => page.messages || []
      );
      setMessages(allMessages);
    }
  }, [messagesPages, id]);

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  useEffect(() => {
    const messagesChannel = supabase
      .channel(`chat-${id}-channel`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          if (payload.new.chat_id === id) {
            setMessages(currentMessages => {
              if (payload.eventType === "INSERT") {
                if (!subscribed) {
                  (async () => {
                    const { error } = await supabase
                      .from("notifications")
                      .insert({
                        // @ts-ignore
                        user_id:
                          chatIds?.data?.receiver_id == session?.user?.id
                            ? chatIds?.data?.user_id
                            : chatIds?.data?.receiver_id,
                        title: session?.user.user_metadata?.full_name,
                        body:
                          payload.new.content_type == "text"
                            ? truncate(payload.new.content, { length: 100 })
                            : payload.new.content_type,
                        image: getPublicUrl(avatar_url!, "avatars") || "",
                        url: `/chats/${id}?full_name=${full_name}&avatar_url=${avatar_url}`
                      })
                      .select()
                      .throwOnError();
                    if (error) {
                      console.log(error);
                    }
                  })();
                }

                if (subscribed) {
                  (async () => {
                    await setMessagesToSeen({
                      chat_id: id! as string,
                      session: session!
                    });
                  })();
                }
                return [...currentMessages, payload.new];
              } else if (payload.eventType === "UPDATE") {
                return currentMessages.map(message =>
                  message.id === payload.new.id ? payload.new : message
                );
              } else if (payload.eventType === "DELETE") {
                return currentMessages.filter(
                  message => message.id !== payload.new.id
                );
              }

              return currentMessages;
            });
          }
        }
      )
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (newPresences[0].user != session?.user.id) {
          setSubscribed(true);
        }
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        if (leftPresences[0].user != session?.user.id) {
          setSubscribed(false);
        }
      })
      .subscribe(async status => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        await messagesChannel.track({
          user: session?.user.id,
          online_at: new Date().toISOString()
        });
      });

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [id]);

  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setNewMessage("");
    },
    onError: error => {
      toast.error("Error encountered when sending message");
    }
  });

  const onLoadListener = useCallback(({ elapsedTimeInMs }: any) => {}, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: full_name,
          headerBackVisible: Platform.OS !== "android",
          headerLeft: () =>
            Platform.OS === "android" ? (
              <HStack alignItems="center" space="lg" mr="$2">
                <Button variant="link" size="xl" onPress={() => router.back()}>
                  <ButtonIcon size="xl" as={ArrowLeft} />
                </Button>
                <Avatar bgColor="$amber600" borderWidth="$1" size="md">
                  <AvatarImage
                    source={{
                      uri: getPublicUrl(avatar_url as string, "avatars")
                    }}
                    alt={full_name as string}
                  />
                  {avatar_url ? (
                    <AvatarFallbackText>{full_name}</AvatarFallbackText>
                  ) : null}
                  <AvatarBadge
                    $dark-borderColor="$black"
                    display={subscribed ? "flex" : "none"}
                  />
                </Avatar>
              </HStack>
            ) : null,
          headerTitle: () => (
            <HStack alignItems="center" space="lg" mr="$2">
              {Platform.OS === "ios" ? (
                <Avatar bgColor="$amber600" borderWidth="$1" size="sm">
                  <AvatarImage
                    source={{
                      uri: getPublicUrl(avatar_url as string, "avatars")
                    }}
                    alt={full_name as string}
                  />
                  {avatar_url ? (
                    <AvatarFallbackText>{full_name}</AvatarFallbackText>
                  ) : null}
                  <AvatarBadge
                    $dark-borderColor="$black"
                    display={subscribed ? "flex" : "none"}
                  />
                </Avatar>
              ) : null}
              <Text bold>{full_name}</Text>
            </HStack>
          ),
          headerRight: () => (
            <Menu
              placement="top"
              selectionMode="single"
              onSelectionChange={value => {
                const selectedAction = new Set(value).keys().next().value;
                if (selectedAction === "block-user") {
                  setBlockUserModal(true);
                }
              }}
              trigger={({ ...triggerProps }) => {
                return (
                  <Button variant="link" {...triggerProps}>
                    <ButtonIcon size="xl" as={InfoIcon} />
                  </Button>
                );
              }}
            >
              <MenuItem key="block-user" textValue="Block user">
                <Icon as={ShieldBan} color="$error500" size="lg" mr="$2" />
                <MenuItemLabel color="$error500" size="sm">
                  Block user
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          )
        }}
      />
      <Screen
        edges={[]}
        sx={{
          _dark: {
            backgroundColor: "$black"
          },
          _light: {
            backgroundColor: "$secondary50"
          }
        }}
        paddingHorizontal="$0"
      >
        <KeyboardAvoidingView
          flex={1}
          justifyContent="center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={HEIGHT * 0.1}
        >
          <View
            flex={1}
            sx={{
              _dark: {
                backgroundColor: "$black"
              },
              _light: {
                backgroundColor: "$secondary200"
              }
            }}
          >
            {messagesPending ? (
              <VStack flex={1} justifyContent="center" alignItems="center">
                <Spinner />
              </VStack>
            ) : !messagesPending && messages.length == 0 ? (
              <VStack flex={1} justifyContent="center" alignItems="center" />
            ) : (
              <FlashList
                contentContainerStyle={{ padding: 8 }}
                ListHeaderComponent={
                  messagesPages!?.pages!?.map(page => page.messages).flat()
                    ?.length <= messagesPages!?.pages[0]?.count! &&
                  isFetchingNextPage ? (
                    <VStack alignItems="center" space="md">
                      <Text semibold>Loading older messages</Text>
                      <Spinner />
                    </VStack>
                  ) : null
                }
                extraData={() => {
                  flashListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                  });
                }}
                inverted
                ref={flashListRef}
                showsVerticalScrollIndicator={false}
                data={messages}
                renderItem={item => (
                  <MessageBubble {...item} session={session} />
                )}
                onLoad={onLoadListener}
                estimatedItemSize={200}
                getItemType={({ content_type, ...item }) => {
                  const contentType = content_type as
                    | "image"
                    | "text"
                    | "location"
                    | "file"
                    | "video";
                  return contentType;
                }}
              />
            )}
            {/* Message input and actions menu */}

            <HStack
              width="$full"
              justifyContent="space-between"
              sx={{
                _dark: {
                  backgroundColor: "$secondary800"
                },
                _light: {
                  backgroundColor: "$secondary50"
                }
              }}
              px="$1"
              alignItems="center"
              height={HEIGHT * 0.1}
            >
              <Menu
                onSelectionChange={async value => {
                  const selectedAction = new Set(value).keys().next().value as
                    | "gallery"
                    | "file"
                    | "camera"
                    | "location";
                  if (selectedAction === "gallery") {
                    pickMedia({ type: MEDIA_TYPE.All })
                      .then(async res => {
                        if (res.canceled) return;
                        setUploading(true);
                        const uploadRes = await upload({
                          result: res,
                          bucket: `chat/${id}/`
                        });
                        sendMessageMutation({
                          chat_id: id as string,
                          // @ts-ignore
                          text: uploadRes?.data?.fullPath!,
                          sender_id: session?.user.id!,
                          content_type: res?.assets[0]?.type!
                        });
                        setUploading(false);
                      })
                      .catch(err => err);
                  }

                  if (selectedAction === "camera") {
                    await ImagePicker.requestCameraPermissionsAsync();

                    takeMedia({
                      type: MEDIA_TYPE.All,
                      cameraType: CAMERA_TYPE.back
                    })
                      .then(async res => {
                        if (res.canceled) return;
                        setUploading(true);

                        const uploadRes = await upload({
                          result: res,
                          bucket: `chat/${id}/`
                        });
                        sendMessageMutation({
                          chat_id: id as string,
                          // @ts-ignore
                          text: uploadRes?.data?.fullPath!,
                          sender_id: session?.user.id!,
                          content_type: res?.assets[0]?.type!
                        });
                        setUploading(false);
                      })
                      .catch(err => {
                        console.log(err.message);
                        toast(`Error: ${err.message}`, {
                          position: ToastPosition.BOTTOM
                        });
                      });
                  }

                  if (selectedAction === "file") {
                    pickDocument()
                      .then(async res => {
                        if (res.canceled) return;
                        setUploading(true);

                        const uploadRes = await upload({
                          result: res,
                          bucket: `chat/${id}/`
                        });
                        sendMessageMutation({
                          chat_id: id as string,
                          // @ts-ignore
                          text: uploadRes?.data?.fullPath!,
                          sender_id: session?.user.id!,
                          content_type: "file"
                        });
                        setUploading(false);
                      })
                      .catch(err => {
                        console.log(err.message);
                        toast(`Error: ${err.message}`, {
                          position: ToastPosition.BOTTOM
                        });
                      });
                  }

                  if (selectedAction === "location") {
                    setOpenLocationSheet(true);
                  }
                  setUploading(false);
                }}
                selectionMode="single"
                placement="top"
                trigger={({ ...triggerProps }) => {
                  return (
                    <Button
                      {...triggerProps}
                      variant="outline"
                      borderColor="transparent"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <ButtonSpinner />
                      ) : (
                        <ButtonIcon
                          size="xl"
                          color="$primary400"
                          as={PlusIcon}
                        />
                      )}
                    </Button>
                  );
                }}
              >
                <MenuItem key="gallery" textValue="Gallery">
                  <Icon as={PhotosIcon} size="sm" mr="$2" />
                  <MenuItemLabel size="sm">Gallery</MenuItemLabel>
                </MenuItem>
                <MenuItem key="camera" textValue="Camera">
                  <Icon as={CameraIcon} size="sm" mr="$2" />
                  <MenuItemLabel size="sm">Camera</MenuItemLabel>
                </MenuItem>
                <MenuItem key="file" textValue="File">
                  <Icon as={FileIcon} size="sm" mr="$2" />
                  <MenuItemLabel size="sm">File</MenuItemLabel>
                </MenuItem>
                <MenuItem key="location" textValue="Location">
                  <Icon as={MapPin} size="sm" mr="$2" />
                  <MenuItemLabel size="sm">Location</MenuItemLabel>
                </MenuItem>
              </Menu>
              <AnimatedView flex={1} height="$12">
                {!isRecording ? (
                  <Motion.View
                    style={{ flex: 1 }}
                    key="A"
                    initial={{ opacity: 0.1, x: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: 0, rotateX: "180deg" }}
                    transition={{
                      default: {
                        type: "spring",
                        bounciness: 10
                      }
                    }}
                  >
                    <Textarea flex={1}>
                      <TextareaInput
                        placeholder="New Message"
                        value={newMessage}
                        onChangeText={text => setNewMessage(text)}
                        returnKeyType="default"
                      />
                    </Textarea>
                  </Motion.View>
                ) : (
                  <Motion.View
                    style={{ flex: 1 }}
                    key="B"
                    initial={{ opacity: 0.1, x: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: 0, rotateX: "180deg" }}
                    transition={{
                      default: {
                        type: "spring",
                        bounciness: 10
                      }
                    }}
                  >
                    <HStack
                      flex={1}
                      alignItems="center"
                      justifyContent="space-between"
                      px="$2"
                      borderWidth="$1"
                      borderColor="$secondary600"
                      rounded="$lg"
                    >
                      <Text semibold>Recording</Text>
                      <HStack alignItems="center" space="sm">
                        <BlinkingView
                          width="$2"
                          height="$2"
                          rounded="$full"
                          bg="$primary400"
                        />
                        <Text semibold>{count}s</Text>
                      </HStack>
                    </HStack>
                  </Motion.View>
                )}
              </AnimatedView>

              <Button
                px="$2"
                variant="outline"
                borderColor="transparent"
                onPressIn={async () => {
                  if (permissionResponse?.status !== "granted") {
                    await requestPermission();
                    return;
                  }
                  await startRecording();
                }}
                onPressOut={stopRecording}
              >
                <ButtonIcon size="xl" color="$primary400" as={MicIcon} />
              </Button>

              <Button
                variant="outline"
                px="$2"
                isDisabled={
                  newMessage.length === 0 || containsWhiteSpace(newMessage)
                }
                borderColor="transparent"
                onPress={() =>
                  sendMessageMutation({
                    chat_id: id as string,
                    text: newMessage.trim(),
                    sender_id: session?.user.id!
                  })
                }
              >
                <ButtonIcon size="xl" color="$primary400" as={SendIcon} />
              </Button>
            </HStack>
          </View>
        </KeyboardAvoidingView>
      </Screen>
      <AlertDialog
        isOpen={blockUserModal}
        onClose={() => {
          setBlockUserModal(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Block User</Heading>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm">
              You're about to block{" "}
              <Text fontWeight="$bold">{full_name as string}</Text>. This will
              prevent you from interacting with this user until you unblock
              them.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setBlockUserModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                bg="$error600"
                action="negative"
                isDisabled={blockingUser}
                onPress={async () => {
                  setBlockingUser(true);
                  await blockUserMutation({
                    session: session!,
                    blocked_id:
                      chatIds?.data?.user_id! == session?.user.id
                        ? chatIds?.data?.receiver_id!
                        : chatIds?.data?.user_id!
                  });
                }}
              >
                {blockingUser && <ButtonSpinner mr="$2" />}
                <ButtonText>Block</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LocationSheet
        openLocationSheet={openLocationSheet}
        handleLocationSheetClose={handleLocationSheetClose}
        sendLocation={location => {
          sendMessageMutation({
            chat_id: id as string,
            content_type: "location",
            text: JSON.stringify(location?.coords),
            sender_id: session?.user.id!
          });
        }}
      />
    </>
  );
}

export default memo(ChatRoomScreen);
