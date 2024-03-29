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
import IconButton from "@/modules/common/ui/icon-button";
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
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Avatar,
  CardProps,
  MessageStatus,
  MessageType,
  useMessageContext
} from "stream-chat-expo";
import { flex, sizes } from "../../common/ui/global";
import PeekabooView from "./peekaboo-view";
import SoundWave from "./sound-wave";

const MessageAttachment = ({
  audio_length,
  asset_url: assetUrl,
  type,
  user,
  latitude,
  longitude
}: CardProps &
  MessageType & {
    latitude?: number;
    longitude?: number;
  }) => {
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
  if (type != "voice-message" && type != "location") return null;

  // @ts-ignore
  if (type == "location") {
    const mapApi = prepareStaticMapUrl(latitude, longitude);
    return (
      <View p="$3" direction={isMyMessage ? "ltr" : "rtl"}>
        <TouchableOpacity onPress={() => goToGoogleMaps(latitude, longitude)}>
          <Image
            source={{ uri: mapApi }}
            style={{ height: 200, width: 300, borderRadius: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <HStack p="$3" direction={isMyMessage ? "ltr" : "rtl"}>
      <View>
        <Avatar image={user?.image || ""} name={""} size={48} />
        <Icon
          as={Mic}
          sx={{
            _dark: {
              color: isMyMessage ? "$white" : "$primary400"
            }
          }}
          position="absolute"
          bottom={0}
          right={isMyMessage ? "-$2" : undefined}
        />
      </View>

      <HStack p="$1" width="$64">
        {isPlaying ? (
          <Button variant="link" onPress={onPausePlay} isDisabled={!isPlaying}>
            <ButtonIcon
              as={Pause}
              sx={{
                _dark: {
                  color: isMyMessage ? "$white" : "$primary400"
                }
              }}
            />
          </Button>
        ) : (
          <Button variant="link" onPress={onStartPlay} isDisabled={isPlaying}>
            <ButtonIcon
              as={Play}
              sx={{
                _dark: {
                  color: isMyMessage ? "$white" : "$primary400"
                }
              }}
            />
          </Button>
        )}

        <View flex={1} justifyContent="space-between" height={58}>
          <SoundWave
            assetUrl={assetUrl as string}
            isMyMessage={isMyMessage}
            currentDurationInSeconds={currentDurationInSeconds}
            currentPositionInSeconds={currentPositionInSeconds}
          />
          <View style={flex.directionRowContentSpaceBetween}>
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
          </View>
        </View>
      </HStack>
    </HStack>
  );
};

export default MessageAttachment as React.ComponentType;
