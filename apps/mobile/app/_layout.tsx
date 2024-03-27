import { config } from "@/config/gluestack-ui.config";
import { getStreamChatClient } from "@/lib/helpers/getstream";
import { useChatClient } from "@/lib/hooks/use-chat-client";
import { ChatProvider } from "@/lib/providers/chat";
import QueryProvider from "@/lib/providers/query";
import { SessionProvider } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
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
import {
  GluestackUIProvider,
  useColorMode,
  useToken
} from "@gluestack-ui/themed";
import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { router, SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, DeepPartial, OverlayProvider, Theme } from "stream-chat-expo";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "/(drawer)/(tabs)/home"
};

notifee.onBackgroundEvent(async ({ detail, type }) => {
  // user press on notification detected while app was on background on Android
  if (type === EventType.PRESS) {
    const channelId = detail.notification?.data?.channel_id as string;
    if (channelId) {
      router.navigate(`/chat/${channelId}`);
    }
    await Promise.resolve();
  }
});

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
              <SessionProvider>
                <RootLayoutNav />
              </SessionProvider>
            </QueryProvider>
          </ErrorBoundary>
          <Toasts />
        </GluestackUIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorMode = useColorMode();
  const { unreadCount } = useChatClient();

  const listLightBackgroundColor = useToken("colors", "secondary200");
  const listMessengerLightBackgroundColor = useToken("colors", "secondary300");

  const listDarkBackgroundColor = useToken("colors", "black");
  const listMessengerDarkBackgroundColor = useToken("colors", "secondary800");

  const chatTheme: DeepPartial<Theme> = {
    channelListMessenger: {
      flatList: {
        backgroundColor:
          colorMode == "light"
            ? listMessengerLightBackgroundColor
            : listMessengerDarkBackgroundColor
      },
      flatListContent: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      }
    },
    channelPreview: {
      container: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor
      },
      title: {
        color: colorMode == "light" ? "black" : "white"
      }
    },
    channelListSkeleton: {
      container: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      },
      // @ts-ignore
      maskFillColor: colorMode == "light" ? "white" : "black",
      background: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor
      }
    },
    messageList: {
      container: {
        backgroundColor:
          colorMode == "light"
            ? listLightBackgroundColor
            : listDarkBackgroundColor
      }
    },
    messageInput: {
      container: {
        backgroundColor:
          colorMode == "light" ? "white" : listMessengerDarkBackgroundColor,
        paddingBottom: HEIGHT * 0.03
      },
      inputBoxContainer: {
        borderColor:
          colorMode == "light"
            ? listMessengerDarkBackgroundColor
            : listMessengerLightBackgroundColor
      },
      inputBox: {
        color: colorMode == "light" ? "black" : "white"
      }
    }
  };

  useEffect(() => {
    const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        // Notification caused app to open from background state on iOS
        const channelId = remoteMessage.data?.channel_id as string;
        if (channelId) {
          // navigateToChannel(channelId);
          router.navigate(`/chat/${channelId}/`);
          console.log(channelId);
        }
      }
    );
    // handle notification clicks on foreground
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(
      ({ detail, type }) => {
        if (type === EventType.PRESS) {
          // user has pressed the foreground notification
          const channelId = detail.notification?.data?.channel_id as string;
          if (channelId) {
            router.navigate(`/chat/${channelId}/`);
          }
        }
      }
    );
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification) {
        // Notification caused app to open from quit state on Android
        const channelId = initialNotification.notification.data
          ?.channel_id as string;
        if (channelId) {
          router.navigate(`/chat/${channelId}`);
          console.log(channelId);
        }
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // Notification caused app to open from quit state on iOS
          const channelId = remoteMessage.data?.channel_id as string;
          if (channelId) {
            // this will make the app to start with the channel screen with this channel id
            router.navigate(`/chat/${channelId}/`);
            console.log(channelId);
          }
        }
      });
    return () => {
      unsubscribeOnNotificationOpen();
      unsubscribeForegroundEvent();
    };
  }, []);

  return (
    <ChatProvider unreadCount={unreadCount!}>
      <OverlayProvider value={{ style: chatTheme }}>
        {/* @ts-ignore */}
        <Chat client={getStreamChatClient}>
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
        </Chat>
      </OverlayProvider>
    </ChatProvider>
  );
}
