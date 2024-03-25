import { supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import { Screen } from "@/modules/common/ui/screen";
import { Center, Spinner, Text } from "@gluestack-ui/themed";
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export default function SplashPage() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (session !== undefined) {
      if (session == null) {
        router.replace("/(auth)");
      }
      if (session) {
        requestUserPermission().then(async enabled => {
          if (enabled && Device.isDevice) {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            await supabase.from("profiles").upsert({
              id: session?.user.id!,
              fcm_token: token
            });
          }
        });

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
            fontFamily="Inter_600SemiBold"
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
