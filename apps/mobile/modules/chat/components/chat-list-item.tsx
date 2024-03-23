import { setMessagesToSeen } from "@/lib/data/chat";
import { getPublicUrl } from "@/lib/helpers/supabase";
import { HEIGHT } from "@/lib/utils/constants";
import { timeAgo } from "@/lib/utils/time-ago";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import { router, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function ChatListItem({
  chat_id,
  user_id,
  last_message,
  session
}: any) {
  return (
    <TouchableOpacity
      onPress={() => {
        setMessagesToSeen({ chat_id, session });
        router.push(
          `/chats/${chat_id}?full_name=${user_id?.full_name || "No name"}&avatar_url=${user_id?.avatar_url}`
        );
      }}
    >
      <HStack
        width="$full"
        height={HEIGHT * 0.12}
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth="$1"
        px="$6"
        sx={{
          _dark: {
            backgroundColor: "$secondary800",
            borderBottomColor: "$secondary500"
          },
          _light: {
            backgroundColor: "$white",
            borderBottomColor: "$coolGray300"
          }
        }}
      >
        <HStack alignItems="flex-start" maxWidth={"$2/3"} flex={1}>
          {/* user profile photo */}
          <Avatar bgColor="$amber600" mr="$2" size="md" borderRadius="$full">
            <AvatarFallbackText>
              {/* @ts-ignore */}
              {user_id?.full_name || "No name"}
            </AvatarFallbackText>
            {user_id?.avatar_url ? (
              <AvatarImage
                // @ts-ignore
                source={{ uri: getPublicUrl(user_id?.avatar_url, "avatars") }}
                alt={user_id?.full_name || ""}
              />
            ) : null}
          </Avatar>
          {/* User name and last message */}
          <VStack justifyContent="flex-start" height="$full">
            <Text semibold> {user_id?.full_name || "No name"}</Text>
            <HStack
              justifyContent="space-between"
              width="$full"
              alignItems="center"
            >
              {last_message ? (
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  bold={
                    !last_message.seen &&
                    last_message.sender_id !== session?.user.id
                  }
                >
                  {last_message?.sender_id === session?.user.id && "You: "}
                  {last_message.content_type == "text"
                    ? last_message?.content
                    : last_message?.content_type}
                </Text>
              ) : null}

              {last_message ? (
                <View
                  width="$2"
                  height="$2"
                  display={
                    !last_message.seen &&
                    last_message.sender_id !== session?.user.id
                      ? "flex"
                      : "none"
                  }
                  rounded="$full"
                  bgColor="$primary600"
                />
              ) : null}
            </HStack>
          </VStack>
        </HStack>
        {/* Time of last message */}
        <VStack height="$2/3" justifyContent="flex-start">
          <Text fontWeight="$bold" fontSize="$sm" opacity="$60">
            {last_message?.created_at && timeAgo(last_message?.created_at)}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
