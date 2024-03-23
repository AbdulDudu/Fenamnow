import { Ionicons } from "@expo/vector-icons";
import { Database } from "@fenamnow/types/database";
import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import { Session } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { capitalize } from "lodash";
import { useRef, useState } from "react";
import AudioMessage from "./audio";
import FileMessage from "./file";
import ImageMessage from "./image";
import LocationMessage from "./location";
import TextMessage from "./text";
import VideoMessage from "./videos";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

const MessageBubble = ({
  item,
  session
}: {
  item: Message;
  session: Session | null | undefined;
}) => {
  const lastItemId = useRef(item.id);
  if (item.id !== lastItemId.current) {
    lastItemId.current = item.id;
  }
  const renderMessage = () => {
    switch (item.content_type) {
      case "text":
        return (
          <TextMessage
            content={item.content}
            isSender={item.sender_id == session?.user.id}
          />
        );
      case "image":
        return <ImageMessage content={item.content} />;
      case "location":
        return <LocationMessage content={item.content} />;
      case "video":
        return <VideoMessage content={item.content} />;
      case "file":
        return <FileMessage content={item.content} />;
      case "audio":
        return <AudioMessage content={item.content} />;
    }
  };

  return (
    <VStack
      alignSelf={
        item.sender_id === session?.user.id ? "flex-end" : "flex-start"
      }
    >
      <Box
        maxWidth="$2/3"
        rounded="$xl"
        minHeight="$1/3"
        padding="$4"
        my="$2"
        alignSelf={
          item.sender_id === session?.user.id ? "flex-end" : "flex-start"
        }
        backgroundColor={
          item.sender_id === session?.user.id
            ? "$primary300"
            : "$backgroundDark300"
        }
        sx={{
          _light: {
            backgroundColor:
              item.sender_id === session?.user.id
                ? "$primary300"
                : "$secondary300"
          },
          _dark: {
            backgroundColor:
              item.sender_id === session?.user.id
                ? "$primary300"
                : "$secondary700"
          }
        }}
      >
        {renderMessage()}
        <HStack justifyContent="space-between">
          <Text
            textAlign={item.sender_id === session?.user.id ? "right" : "left"}
            fontSize="$sm"
            sx={{
              _light: {
                color: item.sender_id === session?.user.id ? "$white" : "$black"
              },
              _dark: {
                color:
                  item.sender_id === session?.user.id
                    ? "$white"
                    : "$secondary200"
              }
            }}
            opacity="$40"
            semibold
          >
            {capitalize(
              formatDistanceToNow(new Date(item.created_at as any), {
                addSuffix: true
              })
            )}
          </Text>
          {item.seen && item.sender_id == session?.user.id ? (
            <Ionicons
              style={{
                alignSelf: "flex-end",
                opacity: 0.5
              }}
              name="checkmark-done"
              size={24}
              color="black"
            />
          ) : null}
        </HStack>
      </Box>
    </VStack>
  );
};

export default MessageBubble;
