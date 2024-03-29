import { useChatProviderContext } from "@/lib/providers/chat";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import { Center, Text, View } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { ChannelList } from "stream-chat-expo";

export default function ChatListScreen() {
  const { session } = useSession();
  const { setChannel } = useChatProviderContext();
  const router = useRouter();

  if (!session) {
    return <ScreenProtector />;
  }

  return (
    <Screen px="$0" edges={[]}>
      <ChannelList
        onSelect={channel => {
          // @ts-ignore
          setChannel(channel);
          router.navigate(`/chat/${channel.cid}`);
        }}
        filters={{
          members: {
            $in: [session?.user?.id!]
          },
          muted: false
        }}
        numberOfSkeletons={12}
        EmptyStateIndicator={() => (
          <View
            height={HEIGHT}
            width="100%"
            sx={{
              _dark: {
                backgroundColor: "$black"
              },
              _light: {
                backgroundColor: "$secondary200"
              }
            }}
          >
            <Center flex={1}>
              <Text fontSize="$lg" semibold>
                No conversations found
              </Text>
            </Center>
          </View>
        )}
        sort={{
          last_message_at: -1
        }}
      />
    </Screen>
  );
}
