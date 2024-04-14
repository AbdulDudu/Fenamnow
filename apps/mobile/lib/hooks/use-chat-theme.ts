import { useToken } from "@gluestack-style/react";
import { useEffect, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import type { DeepPartial, Theme } from "stream-chat-expo";

const getChatStyle = (
  colorScheme: ColorSchemeName,
  primaryColor = "#1fa2ff"
): DeepPartial<Theme> => ({
  messageSimple: {
    content: {
      containerInner: {
        backgroundColor: primaryColor,
        padding: 4,
        borderColor: "transparent"
      }
    }
  },
  colors:
    colorScheme === "dark"
      ? {
          accent_blue: "#1fa2ff",
          accent_green: "#20E070",
          accent_red: "#FF3742",
          bg_gradient_end: "#101214",
          bg_gradient_start: "#070A0D",
          black: "#FFFFFF",
          blue_alice: "#00193D",
          border: "#141924",
          button_background: "#FFFFFF",
          button_text: "#1fa2ff",
          grey: "#7A7A7A",
          grey_gainsboro: "#2D2F2F",
          grey_whisper: "#1C1E22",
          icon_background: "#FFFFFF",
          modal_shadow: "#000000",
          overlay: "#FFFFFFCC",
          shadow_icon: "#00000080",
          targetedMessageBackground: "#333024",
          transparent: "transparent",
          white: "#101418",
          white_smoke: "#13151B",
          white_snow: "#070A0D"
        }
      : {
          accent_blue: "#0e96f8",
          accent_green: "#20E070",
          accent_red: "#FF3742",
          bg_gradient_end: "#F7F7F7",
          bg_gradient_start: "#FCFCFC",
          black: "#000000",
          blue_alice: "#E9F2FF",
          border: "#00000014",
          button_background: "#0e96f8",
          button_text: "#FFFFFF",
          grey: "#7A7A7A",
          grey_gainsboro: "#DBDBDB",
          grey_whisper: "#ECEBEB",
          icon_background: "#FFFFFF",
          modal_shadow: "#00000099", // 99 = 60% opacity; x=0, y= 1, radius=4
          overlay: "#00000099", // 99 = 60% opacity
          shadow_icon: "#00000040", // 40 = 25% opacity; x=0, y=0, radius=4
          targetedMessageBackground: "#FBF4DD", // dark mode = #302D22
          transparent: "transparent",
          white: "#FFFFFF",
          white_smoke: "#F2F2F2",
          white_snow: "#FCFCFC"
        }
});

export const useChatTheme = () => {
  const colorScheme = useColorScheme();
  const primaryColor = useToken("colors", "primary500");

  const [chatStyle, setChatStyle] = useState(
    getChatStyle(colorScheme, primaryColor)
  );

  useEffect(() => {
    setChatStyle(getChatStyle(colorScheme));
  }, [colorScheme]);

  return chatStyle;
};
