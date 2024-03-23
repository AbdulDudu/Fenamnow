import { Button, ButtonText, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { Screen } from "./screen";

export default function ScreenProtector() {
  const router = useRouter();

  return (
    <Screen justifyContent="center" gap="$4" alignItems="center">
      <Text fontSize="$lg" fontWeight="$semibold">
        Sign in to access this page
      </Text>
      <Button
        action={"primary"}
        variant={"solid"}
        size={"lg"}
        onPress={() => router.push("/(auth)")}
      >
        <ButtonText>Login</ButtonText>
      </Button>
    </Screen>
  );
}
