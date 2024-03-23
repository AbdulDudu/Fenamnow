import { getUserProfile } from "@/lib/data/profile";
import { getPublicUrl, supabase } from "@/lib/helpers/supabase";
import { useSession } from "@/lib/providers/session";
import { HEIGHT } from "@/lib/utils/constants";
import { Screen } from "@/modules/common/ui/screen";
import ScreenProtector from "@/modules/common/ui/screen-protector";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  Image,
  Input,
  InputField,
  Text,
  useColorMode,
  VStack
} from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { capitalize } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";

export default function ProfileScreen() {
  const { session } = useSession();
  const colorMode = useColorMode();
  const router = useRouter();

  const { data: profileData, isPending } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => getUserProfile({ session: session! })
  });

  if (!session) {
    return <ScreenProtector />;
  }

  if (isPending || profileData === undefined) {
    return (
      <Screen edges={[]} justifyContent="center">
        <Skeleton
          colorMode={colorMode as any}
          height={HEIGHT * 0.5}
          width={"100%"}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={[]} justifyContent="center">
      <Box
        sx={{
          _dark: {
            backgroundColor: "$secondary800"
          },
          _light: {
            backgroundColor: "$white"
          }
        }}
        width={"100%"}
        rounded="$lg"
      >
        <VStack
          height={HEIGHT * 0.5}
          rounded="$lg"
          p="$6"
          justifyContent="space-between"
          width={"100%"}
        >
          {/* Profile data */}
          <VStack
            width="$full"
            height="30%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Center
              borderRadius="$full"
              rounded="$full"
              borderWidth="$2"
              width="$24"
              height="$24"
            >
              {session?.user.user_metadata?.avatar_url ? (
                <Image
                  alt={session?.user.user_metadata.full_name}
                  objectFit="cover"
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    height: "100%"
                  }}
                  source={{
                    uri: getPublicUrl(
                      session?.user.user_metadata?.avatar_url as string,
                      "avatars"
                    )
                  }}
                />
              ) : (
                <FontAwesome5 name="user" size={32} color="#5F5F5F" />
              )}
            </Center>
            <Badge
              size="md"
              variant="solid"
              borderRadius="$lg"
              justifyContent="center"
              action="info"
            >
              <BadgeText>{capitalize(profileData.data?.type)}</BadgeText>
            </Badge>
          </VStack>
          {/* Account Stats */}

          <VStack width="$full" height="20%">
            <Text opacity="$60" fontSize="$sm">
              Full name
            </Text>

            <Text fontWeight="$medium">
              {session?.user.user_metadata.full_name}
            </Text>
          </VStack>

          <VStack width="$full" height="20%">
            <Text opacity="$60" fontSize="$sm">
              Email
            </Text>

            <Text fontWeight="$medium">{session?.user.email}</Text>
          </VStack>

          <VStack width="$full" height="20%">
            <Text opacity="$60" fontSize="$sm">
              Joined on
            </Text>
            <Text fontWeight="$medium">
              {new Date(session?.user.created_at as string).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }
              )}
            </Text>
          </VStack>

          <HStack justifyContent="space-between">
            <Button onPress={() => router.push("/settings/")}>
              <ButtonText>Edit Profile</ButtonText>
            </Button>

            {/* {profileData.data?.type !== "agent" && (
              <Button
                variant="link"
                onPress={() => router.push("/settings/agent-verification/")}
              >
                <ButtonText>Become an agent?</ButtonText>
              </Button>
            )} */}
            <Button
              variant="link"
              onPress={() => router.push("/settings/agent-verification/")}
            >
              <ButtonText>Become an agent?</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Screen>
  );
}
