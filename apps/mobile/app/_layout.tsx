import "intl-pluralrules";
import { config } from "@/config/gluestack-ui.config";
import { getStreamChatClient } from "@/lib/helpers/getstream";
import { supabase } from "@/lib/helpers/supabase";
import { useChatClient } from "@/lib/hooks/use-chat-client";
import { useChatTheme } from "@/lib/hooks/use-chat-theme";
import { ChatProvider } from "@/lib/providers/chat";
import QueryProvider from "@/lib/providers/query";
import { SessionProvider } from "@/lib/providers/session";
import { ErrorBoundary } from "@/modules/common/error-boundary/error-boundary";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  NotoSans_100Thin,
  NotoSans_200ExtraLight,
  NotoSans_300Light,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSans_700Bold,
  useFonts
} from "@expo-google-fonts/noto-sans";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import {
  router,
  SplashScreen,
  Stack,
  useGlobalSearchParams,
  usePathname
} from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";

SplashScreen.preventAutoHideAsync();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const messageId = remoteMessage.data?.id as string;
  if (!messageId) {
    return;
  }
  const chatToken = await AsyncStorage.getItem("chat_token");

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

export const unstable_settings = {
  initialRouteName: "index"
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
  useEffect(() => {
    const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        // Notification caused app to open from background state on iOS
        const channelId = remoteMessage.data?.channel_id as string;
        if (channelId) {
          router.navigate(`/chat/${channelId}/`);
        }
      }
    );
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification) {
        // Notification caused app to open from quit state on Android
        const channelId = initialNotification.notification.data
          ?.channel_id as string;
        if (channelId) {
          router.push(`/chat/${channelId}/`);
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
            router.push(`/chat/${channelId}/`);
          }
        }
      });
    return () => {
      unsubscribeOnNotificationOpen();
    };
  }, []);

  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    NotoSans_100Thin,
    NotoSans_200ExtraLight,
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold
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
            <Toasts />
          </ErrorBoundary>
        </GluestackUIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { unreadCount } = useChatClient();
  const streamChatTheme = useChatTheme();

  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    (async () => {
      await analytics().logScreenView({ pathname, params });
    })();
  }, [pathname, params]);

  useEffect(() => {
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

    return () => {
      unsubscribeForegroundEvent();
    };
  }, []);

  return (
    <ChatProvider unreadCount={unreadCount}>
      <OverlayProvider value={{ style: streamChatTheme }}>
        {/* @ts-ignore */}
        <Chat client={getStreamChatClient}>
          <Stack
            screenOptions={{
              headerBackTitleVisible: false,
              headerTitleStyle: {
                fontFamily: "NotoSans_600SemiBold"
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
