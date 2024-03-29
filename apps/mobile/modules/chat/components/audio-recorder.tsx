import { getStreamChatClient } from "@/lib/helpers/getstream";
import { useChatProviderContext } from "@/lib/providers/chat";
import RecordingBlinking from "@/modules/common/ui/icons/RecordingBlinking";
import { HStack, Text } from "@gluestack-ui/themed";
import { set } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { MessageResponse } from "stream-chat";
import { useChannelContext, useMessagesContext } from "stream-chat-expo";

const audioRecorderPlayer = new AudioRecorderPlayer();

type Props = {
  recordingActive: boolean;
  recordingDurationInMS: number;
  setRecordingActive(isActive: boolean): void;
  setRecordingDurationInMS(ms: number): void;
};

export default function AudioRecorder({
  recordingActive,
  setRecordingActive,
  recordingDurationInMS,
  setRecordingDurationInMS
}: Props) {
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
