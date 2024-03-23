import { useSession } from "@/lib/providers/session";
import { HEIGHT, WIDTH } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Button,
  ButtonText,
  HStack,
  Icon,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { DotIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";

const redirectTo = makeRedirectUri();

export default function AgentVerificationScreen() {
  const { session } = useSession();
  const [result, setResult] = useState<WebBrowser.WebBrowserResult>();

  const [loading, setLoading] = useState(false);

  // const handleClose = () => setShowVerificationSheet(!showVerificationSheet);
  const verificationPage = `${process.env.EXPO_PUBLIC_WEB_APP_URL}/agent-verification`;

  const handleBeginVerificationAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(verificationPage);
    setResult(result);
  };

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
  return (
    <Screen>
      <VStack flex={1} space="lg">
        <Text fontSize="$xl">
          Before becoming a verified agent on fenamnow we need to verify you
        </Text>
        <Text fontSize="$xl">
          Please have either of the following documents ready before proceeding
        </Text>
        <HStack>
          <Icon size="xl" as={DotIcon} />
          <Text fontSize="$xl" semibold>
            National ID
          </Text>
        </HStack>
        <HStack>
          <Icon size="xl" as={DotIcon} />
          <Text fontSize="$xl" semibold>
            International Passport
          </Text>
        </HStack>

        <Button onPress={handleBeginVerificationAsync}>
          <ButtonText>Get verified</ButtonText>
        </Button>
      </VStack>
    </Screen>
  );
}
