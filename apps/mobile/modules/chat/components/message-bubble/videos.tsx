import { getPublicUrl } from "@/lib/helpers/supabase";
import { HEIGHT } from "@/lib/utils/constants";
import { Box, Button, ButtonIcon, HStack } from "@gluestack-ui/themed";
import { ResizeMode, Video } from "expo-av";
import { PlayCircleIcon } from "lucide-react-native";
import React, { useRef } from "react";

export default function VideoMessage({ content }: { content: string }) {
  const videoRef = useRef<Video>(null);

  return (
    <Box width={HEIGHT * 0.25} rounded="$lg" height={HEIGHT * 0.3}>
      <Video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          borderColor: "#737373"
        }}
        source={{
          uri: getPublicUrl(content!)
        }}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
      <HStack
        position="absolute"
        top="35%"
        left="35%"
        alignItems="center"
        justifyContent="space-between"
        gap="$4"
        rounded="$full"
        bg="$secondary400"
        px="$4"
      >
        <Button
          variant="link"
          onPress={() => videoRef.current?.presentFullscreenPlayer()}
        >
          <ButtonIcon color="$white" size="xl" as={PlayCircleIcon} />
        </Button>
      </HStack>
    </Box>
  );
}
