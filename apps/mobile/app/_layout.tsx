import { config } from "@/config/gluestack-ui.config";
import { ChatProvider } from "@/lib/providers/chat";
import QueryProvider from "@/lib/providers/query";
import { SessionProvider } from "@/lib/providers/session";
import { ChatWrapper } from "@/modules/chat/components/chat-wrapper";
import { ErrorBoundary } from "@/modules/common/error-boundary/error-boundary";
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
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
          <ErrorBoundary catchErrors="always">
            <QueryProvider>
              <ChatProvider>
                <SessionProvider>
                  <RootLayoutNav />
                </SessionProvider>
              </ChatProvider>
            </QueryProvider>
          </ErrorBoundary>
          <Toasts />
        </GluestackUIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  return (
    <ChatWrapper>
      <Stack
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
          name="chat/[cid]/index"
          options={{
            headerBackButtonMenuEnabled: true,
            headerBackTitleVisible: false
          }}
        />
        <Stack.Screen
          name="property/[id]/index"
          options={{
            headerShown: true,
            title: "Property Details"
          }}
        />
      </Stack>
    </ChatWrapper>
  );
}
