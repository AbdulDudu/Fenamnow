import { getStreamChatClient } from "@/lib/helpers/getstream";
import { supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import Storage from "@/lib/utils/storage";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import { Screen } from "@/modules/common/ui/screen";
import { Center, Spinner, Text } from "@gluestack-ui/themed";
import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const messageId = remoteMessage.data?.id as string;
  if (!messageId) {
    return;
  }
  const chatToken = Storage.getItem("chat_token");

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return;
  }

  const user = {
    id: data.user.id,
    image: data.user.user_metadata.avatar_url,
    name: data.user.user_metadata.full_name
  };

  await getStreamChatClient._setToken(user, chatToken);
  const message = await getStreamChatClient.getMessage(messageId);

  // create the android channel to send the notification to
  const channelId = await notifee.createChannel({
    id: "chat-messages",
    name: "Chat Messages"
  });

  if (message.message.user?.name && message.message.text) {
    const { stream, ...rest } = remoteMessage.data ?? {};
    const data = {
      ...rest,
      ...((stream as unknown as Record<string, string> | undefined) ?? {}) // extract and merge stream object if present
    };
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: "default"
        }
      },
      body: message.message.text,
      data,
      title: "New message from " + message.message.user.name
    });
  }
});

export default function SplashPage() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (session !== undefined) {
      if (session == null) {
        router.replace("/(auth)");
      }
      if (session) {
        router.replace({
          pathname: "/(drawer)/(tabs)/home",
          params: {
            listing_type: "rental"
          }
        });
      }
    }
  }, [session]);

  return (
    <Screen position="relative" backgroundColor="#4AA9FF" px="$0">
      <Image
        style={styles.splashImage}
        source={require("@/assets/splash.svg")}
        alt="Fenamnow"
      />
      <Center position="absolute" bottom="$1/4" width="$full">
        <AnimatedView>
          <Text
            bottom="$1/4"
            color="$white"
            fontFamily="NotoSans_600SemiBold"
            fontWeight="600"
            fontSize="$lg"
            textAlign="center"
          >
            Easy search, easy find with Fenamnow
          </Text>
          <Spinner color="$white" size="large" />
        </AnimatedView>
      </Center>
    </Screen>
  );
}

const styles = StyleSheet.create({
  splashImage: {
    height: "100%",
    width: "100%"
  }
});
