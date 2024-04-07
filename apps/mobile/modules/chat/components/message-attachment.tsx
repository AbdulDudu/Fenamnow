import {
  AudioStatus,
  pausePlayer,
  startPlayer
} from "@/lib/utils/audio-manager";
import { parseDurationTextToMs } from "@/lib/utils/conversion";
import {
  goToGoogleMaps,
  prepareStaticMapUrl
} from "@/lib/utils/go-to-googlemaps";
import Star from "@/modules/common/ui/icons/Star";
import {
  Button,
  ButtonIcon,
  HStack,
  Icon,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { isEmpty } from "lodash";
import { Mic, Pause, Play } from "lucide-react-native";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Avatar,
  Card,
  CardProps,
  MessageStatus,
  MessageType,
  useMessageContext
} from "stream-chat-expo";
import { flex, sizes } from "../../common/ui/global";
import PeekabooView from "./peekaboo-view";
import SoundWave from "./sound-wave";

const MessageAttachment = (
  props: CardProps &
    MessageType & {
      latitude?: number;
      longitude?: number;
    }
) => {
  const {
    audio_length,
    asset_url: assetUrl,
    type,
    user,
    latitude,
    longitude
  } = props;
  const audioLength = audio_length as string;
  const initialAudioLengthInSeconds = useMemo(
    () => parseDurationTextToMs(audioLength),
    [audioLength]
  );
  const [currentPositionInSeconds, setCurrentPositionInSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentDurationInSeconds, setCurrentDurationInSeconds] =
    useState<number>(initialAudioLengthInSeconds);
  const { isMyMessage, message } = useMessageContext();

  const onStartPlay = async () => {
    if (!assetUrl) return null;

    await startPlayer(assetUrl, async ({ status, data }) => {
      if (status === AudioStatus.STARTED) {
      } else if (status === AudioStatus.PLAYING) {
        setCurrentPositionInSeconds(data?.currentPosition as number);
        setCurrentDurationInSeconds(data?.duration as number);
      } else if (status === AudioStatus.PAUSED) {
        setPaused(true);
      } else if (status === AudioStatus.RESUMED) {
        setPaused(false);
      } else if (status === AudioStatus.STOPPED) {
        await onStopPlay();
      }
    });
  };

  const onPausePlay = async () => {
    await pausePlayer();
  };

  const onStopPlay = () => {
    setPaused(false);
    setCurrentPositionInSeconds(0);
  };

  const isPlaying = useMemo(
    () => currentPositionInSeconds > 0 && !paused,
    [currentPositionInSeconds, paused]
  );
  const currentPositionFormatted = useMemo(
    () => moment(currentPositionInSeconds).format("m:ss"),
    [currentPositionInSeconds]
  );
  const durationFormatted = useMemo(
    () => moment(currentDurationInSeconds).format("m:ss"),
    [currentDurationInSeconds]
  );

  const isMessageDeleted = useMemo(
    () => !isEmpty(message.deleted_at),
    [message.id]
  );

  // @ts-ignore
  if (type == "location") {
    const mapApi = prepareStaticMapUrl(latitude, longitude);
    return (
      <View p="$0.5" direction={isMyMessage ? "ltr" : "rtl"}>
        <TouchableOpacity onPress={() => goToGoogleMaps(latitude, longitude)}>
          <Image
            source={{ uri: mapApi }}
            style={{ height: 200, width: 300, borderRadius: 12 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // @ts-ignore
  if (type === "voice-message")
    return (
      <HStack p="$3">
        <View>
          <Avatar image={user?.image || ""} name={""} size={48} />
          <Icon
            as={Mic}
            sx={{
              _dark: {
                color: "$white"
              }
            }}
            position="absolute"
            bottom={0}
            right={isMyMessage ? "-$2" : undefined}
          />
        </View>

        <HStack p="$1" space="md" width="$64">
          {isPlaying ? (
            <Button variant="link" onPress={onPausePlay}>
              <ButtonIcon
                as={Pause}
                size="xl"
                sx={{
                  _dark: {
                    color: "$white"
                  }
                }}
              />
            </Button>
          ) : (
            <Button variant="link" onPress={onStartPlay}>
              <ButtonIcon
                as={Play}
                size="xl"
                sx={{
                  _dark: {
                    color: "$white"
                  }
                }}
              />
            </Button>
          )}

          <View flex={1} justifyContent="space-between" height="$16">
            <SoundWave
              assetUrl={assetUrl as string}
              isMyMessage={isMyMessage}
              currentDurationInSeconds={currentDurationInSeconds}
              currentPositionInSeconds={currentPositionInSeconds}
            />
            <HStack justifyContent="space-between">
              <Text>{currentPositionFormatted}</Text>
              <View style={flex.directionRowItemsCenter}>
                <PeekabooView isEnabled={message?.pinned && !isMessageDeleted}>
                  <Star
                    pathFill={"transparent"}
                    width={sizes.m}
                    height={sizes.m}
                    style={{ marginRight: sizes.s }}
                  />
                </PeekabooView>
                <Text>{durationFormatted}</Text>
                <MessageStatus />
              </View>
            </HStack>
          </View>
        </HStack>
      </HStack>
    );

  return null;
};

export default MessageAttachment as React.ComponentType;
