import { config } from "@/config/gluestack-ui.config";
import { chatClient } from "@/lib/helpers/chat";
import { ChatProvider } from "@/lib/providers/chat";
import QueryProvider from "@/lib/providers/query";
import { SessionProvider } from "@/lib/providers/session";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts
} from "@expo-google-fonts/inter";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawers)"
};

SplashScreen.preventAutoHideAsync();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Message handled in the background!", remoteMessage);
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  });

  const colorScheme = useColorScheme();
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => SplashScreen.hideAsync(), 2000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GluestackUIProvider
          config={config}
          colorMode={colorScheme as COLORMODES}
        >
          <OverlayProvider>
            <QueryProvider>
              <SessionProvider>
                <ChatProvider>
                  <RootLayoutNav />
                </ChatProvider>
              </SessionProvider>
            </QueryProvider>
          </OverlayProvider>
          <Toasts />
        </GluestackUIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!remoteMessage?.data?.url) {
          return;
        }
        router.push(remoteMessage?.data?.url as any);
      });
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (!remoteMessage?.data?.url) {
        return;
      }
      router.push(remoteMessage?.data?.url as any);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Stack
      initialRouteName="splash"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold"
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerTitle: "Search" }} />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="property/[id]"
        options={{
          headerTitle: "Property Details"
        }}
      />
      <Stack.Screen
        name="chats/[id]"
        options={{
          headerBackButtonMenuEnabled: true,
          headerBackTitleVisible: false
        }}
      />
    </Stack>
  );
}
