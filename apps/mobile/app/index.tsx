import { useSession } from "@/lib/providers/session";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import { Screen } from "@/modules/common/ui/screen";
import { Center, Spinner, Text } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

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
