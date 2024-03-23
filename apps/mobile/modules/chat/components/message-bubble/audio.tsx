import { getPublicUrl, supabase } from "@/lib/helpers/supabase";
import { HEIGHT } from "@/lib/utils/constants";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import {
  Box,
  Center,
  HStack,
  Icon,
  PlayIcon,
  Pressable,
  Progress,
  ProgressFilledTrack,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { Audio, AVPlaybackStatus } from "expo-av";
import { PauseIcon } from "lucide-react-native";
import ms from "ms";
import React, { useEffect, useState } from "react";

export default function AudioMessage({ content }: { content: string }) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [audioStatus, setAudioStatus] = useState<
    AVPlaybackStatus & {
      positionMillis?: number;
      playableDurationMillis?: number;
    }
  >();
  const [playProgress, setPlayProgress] = useState(0);
  async function playSound() {
    const { sound, status } = await Audio.Sound.createAsync(
      {
        uri: getPublicUrl(content, "chat")
      },
      { shouldPlay: true }
    );

    setSound(sound);
    sound.setOnPlaybackStatusUpdate(
      (
        status: AVPlaybackStatus & {
          positionMillis?: number;
          playableDurationMillis?: number;
        }
      ) => {
        setAudioStatus(status);
        const position =
          Math.ceil(
            ((status?.positionMillis ?? 0) /
              (status?.playableDurationMillis ?? 0)) *
              100
          ) ?? 0;
        position < 100 ? setPlayProgress(position) : setPlayProgress(0);
      }
    );
  }

  const pauseSound = () => {
    if (sound) {
      sound.pauseAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <HStack
      alignItems="center"
      width={HEIGHT * 0.25}
      rounded="$lg"
      height={HEIGHT * 0.08}
      justifyContent="space-between"
      space="sm"
    >
      {!sound || playProgress == 0 ? (
        <AnimatedView>
          <Pressable onPress={async () => await playSound()}>
            <PlayIcon
              sx={{
                _light: {
                  color: "$secondary600"
                },
                _dark: {
                  color: "$secondary200"
                }
              }}
              size="xl"
            />
          </Pressable>
        </AnimatedView>
      ) : (
        <AnimatedView>
          <Pressable onPress={async () => pauseSound()}>
            <Icon
              as={PauseIcon}
              sx={{
                _light: {
                  color: "$secondary600"
                },
                _dark: {
                  color: "$secondary200"
                }
              }}
              size="xl"
            />
          </Pressable>
        </AnimatedView>
      )}
      <VStack flex={1} height="$full" alignItems="flex-end">
        <Center width="$full" flex={1}>
          <Progress value={playProgress} w="$full" size="xs">
            <ProgressFilledTrack />
          </Progress>
        </Center>
      </VStack>
    </HStack>
  );
}
