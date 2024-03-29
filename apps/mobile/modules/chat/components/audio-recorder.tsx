import RecordingBlinking from "@/modules/common/ui/icons/RecordingBlinking";
import { HStack, Text } from "@gluestack-ui/themed";
import moment from "moment";
import React, { useMemo } from "react";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

type Props = {
  recordingDurationInMS: number;
};

export default function AudioRecorder({ recordingDurationInMS }: Props) {
  const formattedAudioDuration = useMemo(
    () => moment(recordingDurationInMS).format("m:ss"),
    [recordingDurationInMS]
  );

  return (
    <HStack
      width="$3/5"
      px="$2"
      height="$12"
      flex={1}
      alignItems="center"
      space="md"
    >
      <Text semibold>Recording</Text>
      <Text semibold>{formattedAudioDuration}</Text>
      <RecordingBlinking />
    </HStack>
  );
}
