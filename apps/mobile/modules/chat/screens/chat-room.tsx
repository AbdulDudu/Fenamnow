import { getStreamChatClient } from "@/lib/helpers/getstream";
import { useChatProviderContext } from "@/lib/providers/chat";
import {
  goToGoogleMaps,
  prepareStaticMapUrl
} from "@/lib/utils/go-to-googlemaps";
import { Screen } from "@/modules/common/ui/screen";
import { toast } from "@backpackapp-io/react-native-toast";
import { useToken } from "@gluestack-style/react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import {
  Button,
  ButtonIcon,
  ButtonText,
  CloseIcon,
  Heading,
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
  Text
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { Ban, InfoIcon, MapPin, Share } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Video as VideoCompressor } from "react-native-compressor";
import {
  Channel,
  ChannelProps,
  MessageInput,
  MessageList,
  MoreOptionsButton,
  QuickSqliteClient,
  Thread,
  useChannelContext,
  useChannelPreviewDisplayName,
  useCreateMessagesContext,
  useMessageActionHandlers,
  useMessageActions,
  useMessageContext,
  useMessagesContext
} from "stream-chat-expo";
import MessageAttachment from "../components/message-attachment";
import { CustomMessageInput } from "../components/message-input";

export default function ChatRoomScreen() {
  const { channel, setChannel } = useChatProviderContext();
  // @ts-ignore
  const title = useChannelPreviewDisplayName(channel!, 30);
  const { cid } = useGlobalSearchParams();
  const primaryColor = useToken("colors", "primary500");
  const [showBlockModal, setShowBlockModal] = useState(false);

  const ref = React.useRef(null);

  useEffect(() => {
    const initChannel = async () => {
      if (channel) {
        return;
      }
      const newChannel = getStreamChatClient.channel(
        "messaging",
        cid as string
      );
      if (!newChannel?.initialized) {
        await newChannel?.watch();
      }

      setChannel(newChannel);
    };
    initChannel();
  }, [cid, channel, getStreamChatClient]);

  if (!cid || !channel) {
    return (
      <>
        <Stack.Screen
          listeners={{
            beforeRemove: () => {
              setChannel(undefined);
            }
          }}
          options={{
            title: "",
            headerBackButtonMenuEnabled: true
          }}
        />
      </>
    );
  }

  return (
    <OverlayProvider>
      <Stack.Screen
        listeners={{
          beforeRemove: () => {
            setChannel(undefined);
          }
        }}
        options={{
          title: title || "",
          headerBackButtonMenuEnabled: true,
          headerRight: () => (
            <Menu
              placement="bottom"
              trigger={({ ...triggerProps }) => {
                return (
                  <Button variant="link" {...triggerProps}>
                    <ButtonIcon size="lg" as={InfoIcon} />
                  </Button>
                );
              }}
            >
              <MenuItem
                onPress={() => {
                  setShowBlockModal(true);
                }}
                key="block-user"
                textValue="Block User"
              >
                <Icon color="$red400" as={Ban} size="lg" mr="$2" />
                <MenuItemLabel color="$red400" size="sm">
                  Block user
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          )
        }}
      />
      <Screen px="$0" edges={[]}>
        <Channel
          // @ts-ignore
          channel={channel!}
          Card={MessageAttachment}
          keyboardVerticalOffset={16}
          Input={() => null}
        >
          <MessageList
            initialScrollToFirstUnreadMessage
            myMessageTheme={{
              messageSimple: {
                content: {
                  containerInner: {
                    backgroundColor: primaryColor,
                    borderColor: "transparent"
                  }
                }
              }
            }}
          />
          <MessageInput Input={CustomMessageInput} />
          <Thread />
        </Channel>
        <Modal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
          }}
          finalFocusRef={ref}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">Block user</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>
                You're about to block {title}. Any messages or files they send
                you will not be visible to you.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowBlockModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="negative"
                borderWidth="$0"
                onPress={async () => {
                  await channel
                    .mute()
                    .then(() => {
                      channel.hide(null, true);
                      setShowBlockModal(false);
                      setChannel(undefined);
                      router.push("../");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }}
              >
                <ButtonText>Block</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Screen>
    </OverlayProvider>
  );
}
