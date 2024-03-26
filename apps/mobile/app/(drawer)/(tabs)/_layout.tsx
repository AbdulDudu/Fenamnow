import { createChatToken } from "@/lib/data/chat";
import { getStreamChatClient } from "@/lib/helpers/getstream";
import { getPublicUrl } from "@/lib/helpers/supabase";
import { useChatClient } from "@/lib/hooks/use-chat-client";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Feather, FontAwesome5, Octicons } from "@expo/vector-icons";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeText,
  Pressable,
  VStack
} from "@gluestack-ui/themed";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useQuery } from "@tanstack/react-query";
import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, useColorScheme } from "react-native";
import { useChatContext } from "stream-chat-expo";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { session } = useSession();

  const { client } = useChatContext();

  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold"
        },
        tabBarActiveTintColor: "#0e96f8",
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 12,
          fontWeight: "600"
        },
        tabBarStyle: {
          height: Platform.OS == "android" ? HEIGHT * 0.07 : HEIGHT * 0.1,
          backgroundColor: colorScheme == "dark" ? "#262626" : "white",
          borderTopEndRadius: 8,
          borderTopLeftRadius: 8
        },
        headerLeft: () => <DrawerToggleButton tintColor="#0e96f8" />
      }}
    >
      <Tabs.Screen
        name="home"
        listeners={{
          tabPress: () => {
            router.setParams({
              listing_type: "rental",
              property_type: "",
              city: "",
              community: ""
            });
          },
          focus: ({}) => {
            router.setParams({
              listing_type: "rental"
            });
          }
        }}
        options={{
          title: "Home",
          headerBackground: () => null,
          headerTransparent: true,
          headerTitle: () => null,
          tabBarIcon: ({ color }) => (
            <Feather
              color={color}
              name="home"
              size={28}
              style={{ marginBottom: -3 }}
            />
          )
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <VStack>
              <Badge
                h={22}
                w={22}
                bg="$red600"
                borderRadius="$full"
                mb={-14}
                mr={-14}
                zIndex={1}
                variant="solid"
                alignSelf="flex-end"
              >
                {/* <BadgeText color="$white">{unreadCount}</BadgeText> */}
              </Badge>
              <Feather
                color={color}
                name="message-square"
                size={28}
                style={{ marginBottom: -3 }}
              />
            </VStack>
          )
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bookmark" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) =>
            session && session.user.user_metadata.avatar_url ? (
              <Avatar bgColor="$amber600" size="sm" borderRadius="$full">
                <AvatarFallbackText>
                  {session.user.user_metadata.full_name}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: getPublicUrl(
                      session.user.user_metadata.avatar_url,
                      "avatars"
                    )
                  }}
                  alt={session.user.user_metadata.full_name}
                />
              </Avatar>
            ) : (
              <TabBarIcon name="user" color={color} />
            ),
          headerRight: () =>
            session ? (
              <Pressable
                onPress={() => {
                  router.push("/settings/");
                }}
                style={{ marginRight: 16 }}
              >
                <Octicons name="gear" size={24} color="#0e96f8" />
              </Pressable>
            ) : null
        }}
      />
    </Tabs>
  );
}
