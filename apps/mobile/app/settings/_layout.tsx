import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold"
        },
        headerBackVisible: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Settings"
        }}
      />
      <Stack.Screen
        name="agent-verification/index"
        options={{ title: "Agent Verification" }}
      />
    </Stack>
  );
}
