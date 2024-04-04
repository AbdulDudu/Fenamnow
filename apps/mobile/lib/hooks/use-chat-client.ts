import { StreamChatGenerics } from "@fenamnow/types/chat";
import notifee from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { StreamChat } from "stream-chat";
import { createChatToken } from "../data/chat";
import { getStreamChatClient } from "../helpers/getstream";
import { supabase } from "../helpers/supabase";
import { useSession } from "../providers/session";

const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const isEnabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return isEnabled;
};

export const useChatClient = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [chatClient, setChatClient] =
    useState<StreamChat<StreamChatGenerics> | null>(null);
  const { session } = useSession();
  const [unreadCount, setUnreadCount] = useState<number>();
  const unsubscribePushListenersRef = useRef<() => void>();

  const { data } = useQuery({
    queryKey: ["user", session],
    queryFn: async () => (await supabase.auth.getUser()).data,
    enabled: !!session
  });

  useEffect(() => {
    const run = async () => {
      await requestNotificationPermission();
    };
    run();
    return unsubscribePushListenersRef?.current?.();
  }, []);

  useEffect(() => {
    let chatToken;
    const initChat = async () => {
      unsubscribePushListenersRef.current?.();

      if (!data) return;

      chatToken = await AsyncStorage.getItem("chat_token");
      if (!chatToken) {
        const newToken = await createChatToken(data.user?.id!).then(data => {
          return data?.token;
        });
        await AsyncStorage.setItem("chat_token", newToken);
        chatToken = newToken;
      }

      const connectedUser = await getStreamChatClient
        .connectUser(
          {
            id: data.user?.id!
          },
          chatToken
        )
        .catch(e => {
          console.error(e);
          if (e) {
            AsyncStorage.removeItem("chat_token");
            return;
          }
        });

      setIsClientReady(true);

      const initialUnreadCount = connectedUser?.me?.total_unread_count;
      setUnreadCount(initialUnreadCount);
      setIsConnecting(false);
      const permissionAuthStatus = await messaging().hasPermission();
      const isEnabled =
        permissionAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        permissionAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isEnabled) {
        // Register FCM token with stream chat server.
        const token = await messaging().getToken();
        await getStreamChatClient
          .addDevice(token, "firebase", data.user?.id, "android")
          .catch(e => {
            console.error(e);
          });

        await supabase.from("profiles").upsert({
          id: session?.user.id!,
          fcm_token: token
        });
        // Listen to new FCM tokens and register them with stream chat server.
        const unsubscribeTokenRefresh = messaging().onTokenRefresh(
          async newToken => {
            await getStreamChatClient
              .addDevice(token, "firebase", data.user?.id, "android")
              .catch(e => {
                console.error(e);
              });
          }
        );
        // show notifications when on foreground
        const unsubscribeForegroundMessageReceive = messaging().onMessage(
          async remoteMessage => {
            const messageId = remoteMessage.data?.id;
            if (!messageId) {
              return;
            }
            const message = await getStreamChatClient.getMessage(
              messageId as string
            );
            if (message.message.user?.name && message.message.text) {
              // create the android channel to send the notification to
              const channelId = await notifee.createChannel({
                id: "foreground",
                name: "Foreground Messages"
              });
              // display the notification on foreground
              const { stream, ...rest } = remoteMessage.data ?? {};
              const data = {
                ...rest,
                ...((stream as unknown as Record<string, string> | undefined) ??
                  {}) // extract and merge stream object if present
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
          }
        );

        unsubscribePushListenersRef.current = () => {
          unsubscribeTokenRefresh();
          unsubscribeForegroundMessageReceive();
        };
      }
      setIsConnecting(false);
    };
    setIsConnecting(true);
    data?.user && initChat();

    return () => {
      getStreamChatClient && getStreamChatClient.disconnectUser();
    };
  }, [data]);

  useEffect(() => {
    const listener = getStreamChatClient?.on(e => {
      if (e.total_unread_count !== undefined) {
        setUnreadCount(e.total_unread_count);
      } else {
        const countUnread = Object.values(
          getStreamChatClient.activeChannels
        ).reduce((count, channel) => count + channel.countUnread(), 0);
        setUnreadCount(countUnread);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [getStreamChatClient]);

  return { unreadCount, isConnecting, isClientReady };
};
