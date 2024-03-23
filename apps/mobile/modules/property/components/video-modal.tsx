import { getPublicUrl } from "@/lib/helpers/supabase";
import { HEIGHT } from "@/lib/utils/constants";
import { VideoIcon } from "@/modules/common/icons/video";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  View
} from "@gluestack-ui/themed";
import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";

export default function VideoModal({
  isDisabled,
  uri
}: {
  isDisabled: boolean;
  uri: string;
}) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const video = useRef<Video>(null);

  const moalFocusRef = useRef(null);
  return (
    <>
      <Button
        isDisabled={isDisabled}
        width="40%"
        onPress={() => {
          setShowVideoModal(true);
        }}
      >
        <ButtonIcon mr="$1" size="xl" as={VideoIcon} />
        <ButtonText fontSize="$sm">Watch Tour</ButtonText>
      </Button>
      <Modal
        isOpen={showVideoModal}
        onClose={() => {
          setShowVideoModal(false);
        }}
        finalFocusRef={moalFocusRef}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Video Tour</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <View height={HEIGHT * 0.4}>
              <Video
                ref={video}
                style={{ width: "100%", height: "100%" }}
                source={{
                  uri: getPublicUrl(uri! as string, "properties")
                }}
                useNativeControls
                volume={1.0}
                resizeMode={ResizeMode.CONTAIN}
              />
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
