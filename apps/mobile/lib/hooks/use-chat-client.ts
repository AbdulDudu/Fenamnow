import Storage from "@/lib/utils/storage";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Session } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
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
  const { session } = useSession();
  const [unreadCount, setUnreadCount] = useState<number>();
  const unsubscribePushListenersRef = useRef<() => void>();

  useEffect(() => {
    const run = async () => {
      await requestNotificationPermission();
    };
    run();
    return unsubscribePushListenersRef?.current?.();
  }, []);

  useEffect(() => {
    const initChat = async () => {
      unsubscribePushListenersRef.current?.();
      // if (!session) return;
      let chatToken = Storage.getItem("chat_token");
      if (!chatToken && session?.user.id) {
        const newToken = await createChatToken(session?.user?.id!).then(
          data => {
            console.log(data);
            return data?.token;
          }
        );
        Storage.setItem("chat_token", newToken);

        chatToken = newToken;
      }

      // if (session && chatToken) {
      const connectedUser = await getStreamChatClient
        .connectUser(
          {
            id: session?.user?.id || ""
          },
          chatToken
        )
        .catch(e => {
          if (e) {
            Storage.removeItem("chat_token");
            return;
          }
        });
      setIsClientReady(true);

      const initialUnreadCount = connectedUser?.me?.total_unread_count;
      setUnreadCount(initialUnreadCount);
      // }
      setIsConnecting(false);
      const permissionAuthStatus = await messaging().hasPermission();
      const isEnabled =
        permissionAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        permissionAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isEnabled) {
        // Register FCM token with stream chat server.
        const token = await messaging().getToken();
        await getStreamChatClient
          .addDevice(token, "firebase", session?.user?.id ?? "", "android")
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
              .addDevice(token, "firebase", session?.user?.id ?? "", "android")
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
    session !== null && initChat();

    return () => {
      getStreamChatClient && getStreamChatClient.disconnectUser();
    };
  }, [session]);

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
