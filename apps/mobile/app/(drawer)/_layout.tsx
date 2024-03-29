import { useChatProviderContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { HStack, Icon, Text, useColorMode, VStack } from "@gluestack-ui/themed";
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

export default function DrawerLayout() {
  const { session, logout } = useSession();
  const colorMode = useColorMode();

  const { setChannel } = useChatProviderContext();
  const url = process.env.EXPO_PUBLIC_WEB_APP_URL!;

  const goToPrivacyPolicy = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `${url}/legal/privacy-policy`
    );
  };

  const goToTermsOfService = async () => {
    let result = await WebBrowser.openBrowserAsync(
      `${url}/legal/terms-of-service`
    );
  };

  const goToContact = async () => {
    let result = await WebBrowser.openBrowserAsync(`${url}/support`);
  };
  return (
    <Drawer
      initialRouteName="(tabs)"
      defaultStatus="closed"
      screenOptions={{
        drawerType: "front",
        drawerActiveTintColor: "#0e96f8",
        drawerLabelStyle: {
          fontFamily: "NotoSans_700Bold"
        },
        headerLeft: () => <DrawerToggleButton tintColor="#0e96f8" />,
        headerTitleStyle: {
          fontFamily: "NotoSans_600SemiBold"
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
                    fontFamily: "NotoSans_700Bold"
                  }}
                  icon={() => (
                    <Entypo name="log-out" size={24} color="#DC2626" />
                  )}
                  onPress={() => {
                    setChannel(undefined);
                    logout();
                  }}
                />
              ) : (
                <DrawerItem
                  label="Login"
                  labelStyle={{
                    color: "#0e96f8",
                    fontSize: 16,
                    fontFamily: "NotoSans_700Bold"
                  }}
                  onPress={() => router.push("/(auth)")}
                />
              )}
              <DrawerItem
                label="Privacy policy"
                labelStyle={{
                  fontFamily: "NotoSans_700Bold"
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
                  fontFamily: "NotoSans_700Bold"
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
                  fontFamily: "NotoSans_700Bold"
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
