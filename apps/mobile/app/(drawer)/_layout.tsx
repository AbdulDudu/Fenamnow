import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import {
  HStack,
  Icon,
  Pressable,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useColorMode,
  useToast,
  VStack
} from "@gluestack-ui/themed";
import messaging from "@react-native-firebase/messaging";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerToggleButton
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as WebBrowser from "expo-web-browser";
import { CopyrightIcon } from "lucide-react-native";
import { useEffect, useState } from "react";

export default function DrawerLayout() {
  const { session, logout } = useSession();
  const colorMode = useColorMode();

  const url = process.env.EXPO_PUBLIC_WEB_APP_URL!;

  const [result, setResult] = useState<WebBrowser.WebBrowserResult>();

  const goToPrivacyPolicy = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `${url}/legal/privacy-policy`
    );
    setResult(result);
  };

  const goToTermsOfService = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `${url}/legal/terms-of-service`
    );
    setResult(result);
  };

  const goToContact = async () => {
    let result = await WebBrowser.openBrowserAsync(`${url}/support`);
    setResult(result);
  };

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      toast.show({
        placement: "top",
        avoidKeyboard: true,
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="attention" variant="solid">
              <Pressable
                onPress={() => {
                  toast.close(id);
                  router.push(remoteMessage?.data?.url as any);
                }}
              >
                <VStack space="xs">
                  <ToastTitle>{remoteMessage.notification?.title}</ToastTitle>
                  <ToastDescription>
                    {remoteMessage.notification?.body}
                  </ToastDescription>
                </VStack>
              </Pressable>
            </Toast>
          );
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Drawer
      initialRouteName="(tabs)"
      defaultStatus="closed"
      screenOptions={{
        drawerType: "front",
        drawerActiveTintColor: "#0e96f8",
        drawerLabelStyle: {
          fontFamily: "Inter_700Bold"
        },
        headerLeft: () => <DrawerToggleButton tintColor="#0e96f8" />,
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold"
        }
      }}
      drawerContent={props => {
        return (
          <DrawerContentScrollView
            contentContainerStyle={{
              height: "100%"
            }}
            {...props}
          >
            <HStack p="$4">
              {session && session.user.user_metadata?.full_name ? (
                <Text semibold fontSize="$lg">
                  Hi, {session?.user.user_metadata.full_name.split(" ")[0]}
                </Text>
              ) : null}
            </HStack>

            <DrawerItemList {...props} />

            <VStack
              justifyContent="flex-end"
              mt={HEIGHT * 0.5}
              height={HEIGHT * 0.2}
            >
              {session ? (
                <DrawerItem
                  label="Log out"
                  labelStyle={{
                    color: "#DC2626",
                    fontFamily: "Inter_700Bold"
                  }}
                  icon={() => (
                    <Entypo name="log-out" size={24} color="#DC2626" />
                  )}
                  onPress={() => logout()}
                />
              ) : (
                <DrawerItem
                  label="Login"
                  labelStyle={{
                    color: "#0e96f8",
                    fontSize: 16,
                    fontFamily: "Inter_700Bold"
                  }}
                  onPress={() => router.push("/(auth)")}
                />
              )}
              <DrawerItem
                label="Privacy policy"
                labelStyle={{
                  fontFamily: "Inter_700Bold"
                }}
                icon={() => (
                  <MaterialIcons
                    name="shield"
                    color={colorMode == "light" ? "#525252" : "#DBDBDB"}
                    size={24}
                  />
                )}
                onPress={goToPrivacyPolicy}
              />
              <DrawerItem
                label="Terms of service"
                labelStyle={{
                  fontFamily: "Inter_700Bold"
                }}
                icon={() => (
                  <AntDesign
                    name="infocirlceo"
                    color={colorMode == "light" ? "#525252" : "#DBDBDB"}
                    size={24}
                  />
                )}
                onPress={goToTermsOfService}
              />
              <DrawerItem
                label="Help and Support"
                labelStyle={{
                  fontFamily: "Inter_700Bold"
                }}
                icon={() => (
                  <MaterialIcons
                    name="support-agent"
                    color={colorMode == "light" ? "#525252" : "#DBDBDB"}
                    size={24}
                  />
                )}
                onPress={goToContact}
              />
              <HStack alignItems="center" space="md" p="$4">
                <Icon as={CopyrightIcon} />
                <Text semibold>Fenamnow {new Date().getFullYear()}</Text>
              </HStack>
            </VStack>
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        listeners={() => ({
          drawerItemPress: () =>
            router.navigate({
              pathname: "/(drawer)/(tabs)/home",
              params: {
                listing_type: "rental"
              }
            })
        })}
        options={{
          headerShown: false,
          drawerLabel: "Home"
        }}
      />

      <Drawer.Screen
        name="dashboard"
        options={{
          drawerItemStyle: {
            // display: session ? 'flex' : 'none',
            display: "none"
          },
          headerTitle: "Dashboard",
          drawerLabel: "Dashboard"
        }}
      />

      <Drawer.Screen
        name="(properties)"
        options={{
          drawerItemStyle: {
            display:
              session && session.user.user_metadata.type == "agent"
                ? "flex"
                : "none"
          },
          headerTitle: "Properties",
          drawerLabel: "Properties"
        }}
      />
    </Drawer>
  );
}
