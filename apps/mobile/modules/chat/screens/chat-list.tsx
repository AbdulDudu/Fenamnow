import { useSession } from "@/lib/providers/session";
import { Button, ButtonText } from "@gluestack-ui/themed";
import React from "react";
import { Text, View } from "react-native";

export default function ChatListScreen() {
  const { session } = useSession();

  const getToken = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_WEB_APP_URL}/api/chat/token`,
        {
          method: "POST",
          body: JSON.stringify({ id: session?.user.id })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get token");
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View>
      <Text>ChatListScreen</Text>
      <Button onPress={getToken}>
        <ButtonText>Get token</ButtonText>
      </Button>
    </View>
  );
}
