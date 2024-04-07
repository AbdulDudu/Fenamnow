import { getStreamChatClient } from "@/lib/helpers/getstream";
import { useChatProviderContext } from "@/lib/providers/chat";
import { toast } from "@backpackapp-io/react-native-toast";
import { Button, ButtonIcon, HStack, View } from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import { set } from "lodash";
import { Mic, Send } from "lucide-react-native";
import moment from "moment";
import { useState } from "react";
import { Platform } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import {
  AutoCompleteInput,
  FileUploadPreview,
  ImageUploadPreview,
  Reply,
  useMessageInputContext,
  useMessagesContext
} from "stream-chat-expo";
import AttachmentButton from "./attachment-button";
import AudioRecorder from "./audio-recorder";

const audioRecorderPlayer = new AudioRecorderPlayer();

export const CustomMessageInput = (props: any) => {
  const { sendMessage, text, imageUploads, fileUploads } =
    useMessageInputContext();
  const [recordingActive, setRecordingActive] = useState(false);
  const [recordingDurationInMS, setRecordingDurationInMS] = useState(0);

  const { updateMessage } = useMessagesContext();
  const { channel } = useChatProviderContext();

  const sendVoiceMessage = async (uri: string) => {
    // @ts-ignore
    const message: MessageResponse = {
      created_at: moment().toString(),
      attachments: [
        {
          asset_url: uri,
          file_size: 200,
          mime_type: "audio/mp4",
          title: "test.mp4",
          type: "voice-message",
          audio_length: moment(recordingDurationInMS).format("m:ss")
        }
      ],
      mentioned_users: [],
      id: `random-id-${new Date().toTimeString()}`,
      status: "sending",
      type: "regular",
      user: getStreamChatClient.user
    };
    // @ts-ignore
    updateMessage(message);

    const res = await channel?.sendFile(uri, "test.mp4", "audio/mp4");
    const {
      created_at,
      html,
      type,
      status,
      user,
      ...messageWithoutReservedFields
    } = message;
    set(
      messageWithoutReservedFields,
      ["attachments", 0, "asset_url"],
      res?.file
    );
    // @ts-ignore
    await channel?.sendMessage(messageWithoutReservedFields);
  };

  const onStartRecord = async () => {
    try {
      const { granted } = await Audio.getPermissionsAsync();
      if (!granted) {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          toast.error("Microphone permissions not granted");
        }
        return;
      }
      setRecordingActive(true);
      await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordingDurationInMS(Math.floor(e.currentPosition));
      });
    } catch (error) {
      toast.error("Error starting recording");
    }
  };

  const onStopRecord = async () => {
    setRecordingActive(false);

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    if (recordingDurationInMS < 500) {
      setRecordingDurationInMS(0);
      return null;
    }

    setRecordingDurationInMS(0);
    await sendVoiceMessage(result);
  };

  return (
    <View width="$full" px="$4">
      <ImageUploadPreview />
      <FileUploadPreview />
      <Reply />
      <HStack
        height={Platform.OS === "ios" ? "$20" : "$16"}
        justifyContent="space-between"
        space="lg"
        alignItems="center"
      >
        {recordingActive ? (
          <AudioRecorder recordingDurationInMS={recordingDurationInMS} />
        ) : (
          <>
            {/* Attachments button */}
            <AttachmentButton />
            {/* Text input */}
            <HStack
              width="$3/5"
              flex={1}
              borderWidth="$1"
              sx={{
                _dark: {
                  borderColor: "$secondary500"
                }
              }}
              rounded="$md"
              p="$2"
              height="$12"
            >
              <AutoCompleteInput />
            </HStack>
          </>
        )}
        {/* Audio recording button */}
        {!text && !fileUploads.length && !imageUploads.length ? (
          <Button
            variant="link"
            onPressIn={() => onStartRecord()}
            onPressOut={() => onStopRecord()}
          >
            <ButtonIcon size="lg" as={Mic} />
          </Button>
        ) : (
          // Send message button
          <Button
            onPress={() => {
              sendMessage();
            }}
            variant="link"
          >
            <ButtonIcon size="lg" as={Send} />
          </Button>
        )}
      </HStack>
    </View>
  );
};
