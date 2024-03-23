import { Stack, useGlobalSearchParams } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function PropertiesLayout() {
  const { id } = useGlobalSearchParams();

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Properties"
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          title: id ? "Edit Property" : "Add Property",
          animation: Platform.OS === "android" ? "slide_from_right" : "default",
          presentation: "modal"
        }}
      />
    </Stack>
  );
}
