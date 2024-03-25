import { config } from "@/config/gluestack-ui.config";
import { createChatToken } from "@/lib/data/chat";
import { chatClient } from "@/lib/helpers/chat";
import { ChatProvider, useChatContext } from "@/lib/providers/chat";
import QueryProvider from "@/lib/providers/query";
import { SessionProvider, useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
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
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";
import type { DeepPartial, Theme } from "stream-chat-expo";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawers)"
};

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
          <QueryProvider>
            <SessionProvider>
              <ChatProvider>
                <RootLayoutNav />
              </ChatProvider>
            </SessionProvider>
          </QueryProvider>
          <Toasts />
        </GluestackUIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorMode = useColorMode();
  const { session } = useSession();
  const { setChannel } = useChatContext();
  const [initialChannelId, setInitialChannelId] = useState<string>();

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

  const { data } = useQuery({
    queryKey: [session],
    queryFn: () => createChatToken(session?.user.id!),
    enabled: !!session
  });

  console.log(data?.token);

  useEffect(() => {
    const connectUser = async () => {
      session &&
        (await chatClient
          .connectUser(
            {
              id: session?.user.id!,
              name: session?.user.user_metadata.full_name
            },
            data?.token
          )
          .catch(error => console.error(error)));
    };

    connectUser();
  }, [session]);

  return (
    <OverlayProvider
      value={{
        style: chatTheme
      }}
    >
      <Chat
        // @ts-ignore
        client={chatClient}
      >
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
            name="chat/[cid]/index"
            options={{
              headerBackButtonMenuEnabled: true,
              headerBackTitleVisible: false
            }}
          />
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
        </Stack>
      </Chat>
    </OverlayProvider>
  );
}
