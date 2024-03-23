import { getPublicUrl } from "@/lib/helpers/supabase";
import { HEIGHT, WIDTH } from "@/lib/utils/constants";
import {
  Box,
  Button,
  ButtonIcon,
  Center,
  CloseIcon,
  HStack,
  Pressable,
  View
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useState } from "react";
import { Modal } from "react-native";

export default function ImageMessage({ content }: any) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Box width={HEIGHT * 0.25} rounded="$lg" height={HEIGHT * 0.3}>
        <Pressable onPress={() => setShowModal(true)}>
          <Image
            contentFit="cover"
            style={{
              width: "100%",
              borderRadius: 4,
              height: "100%"
            }}
            alt={"Photo"}
            source={{ uri: getPublicUrl(content!) }}
          />
        </Pressable>
      </Box>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ flex: 1 }} pt={HEIGHT * 0.035} backgroundColor="$black">
          <HStack>
            <Button variant="link" onPress={() => setShowModal(false)}>
              <ButtonIcon
                size="xl"
                ml={WIDTH * 0.08}
                as={CloseIcon}
                color="$white"
              />
            </Button>
          </HStack>
          <Center>
            <Image
              contentFit="contain"
              style={{
                width: WIDTH,
                height: HEIGHT
              }}
              alt={"Photo"}
              source={{ uri: getPublicUrl(content!) }}
            />
          </Center>
        </View>
      </Modal>
    </>
  );
}
