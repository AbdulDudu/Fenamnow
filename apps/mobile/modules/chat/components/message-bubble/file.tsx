import { getPublicUrl } from "@/lib/helpers/supabase";
import { HEIGHT } from "@/lib/utils/constants";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Text
} from "@gluestack-ui/themed";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { capitalize } from "lodash";
import { DownloadCloud } from "lucide-react-native";
import React, { useEffect, useState } from "react";

export default function FileMessage({ content }: { content: string }) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const callback = (downloadProgress: any) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    console.log(downloadProgress);
    setDownloadProgress(progress);
  };

  const handleDownload = async (path: string) => {
    try {
      setDownloading(true);
      const fileUri = FileSystem.documentDirectory + path.split("/").pop()!;
      const downloadResumable = FileSystem.createDownloadResumable(
        getPublicUrl(path),
        fileUri
      );
      // @ts-expect-error
      const { uri } = await downloadResumable.downloadAsync();
      toast.success("File downloaded");
      setIsSaved(true);
    } catch (error) {
      toast.error("Error downloading file");
    } finally {
      setDownloading(false);
    }
  };

  const handleCheckFile = async (path: string) => {
    const fileUri = FileSystem.documentDirectory + path.split("/").pop()!;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    setIsSaved(fileInfo.exists);
  };

  const handleOpenFile = async (path: string) => {
    const fileUri = FileSystem.documentDirectory + path.split("/").pop()!;
    Sharing.isAvailableAsync().then(res => {
      if (res) {
        Sharing.shareAsync(fileUri, {
          UTI: path.split(".").pop()!
        });
      } else {
        toast.error("This file cannot be opened");
      }
    });
  };

  useEffect(() => {
    (async () => {
      await handleCheckFile(content!);
      const fileUri = FileSystem.documentDirectory + content!.split("/").pop()!;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      setIsSaved(fileInfo.exists);
    })();
  }, [content]);

  return (
    <Box
      width={HEIGHT * 0.25}
      rounded="$lg"
      mb="$2"
      height={HEIGHT * 0.3}
      position="relative"
    >
      <Center
        height="$2/3"
        borderTopEndRadius={8}
        borderTopStartRadius={8}
        sx={{
          _light: {
            backgroundColor: "$coolGray200"
          },
          _dark: {
            backgroundColor: "$coolGray800"
          }
        }}
      >
        <Text
          semibold
          sx={{
            textTransform: "uppercase"
          }}
        >
          {capitalize(content!.split(".")[1])}
        </Text>
      </Center>
      <HStack
        position="absolute"
        width="$full"
        height="$1/3"
        justifyContent="space-between"
        pt="$1"
        alignItems="flex-start"
        px="$2"
        bottom="$0"
        sx={{
          _light: {
            backgroundColor: "$coolGray400"
          },
          _dark: {
            backgroundColor: "$coolGray500"
          }
        }}
      >
        <Text bold py="$2">
          {content!.split("/").pop()}
        </Text>
        {isSaved ? (
          <Button
            rounded="$full"
            variant="link"
            onPress={() => handleOpenFile(content!)}
          >
            <ButtonText>Open</ButtonText>
          </Button>
        ) : (
          <Button
            rounded="$full"
            variant="link"
            onPress={() => handleDownload(content!)}
          >
            <ButtonIcon as={DownloadCloud} />
          </Button>
        )}
      </HStack>
    </Box>
  );
}
