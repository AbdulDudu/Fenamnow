import { createStyle } from "@gluestack-style/react";

export const ButtonText = createStyle({
  color: "$textLight0",
  fontWeight: "$bold",
  fontFamily: "Inter_500Medium",
  _web: {
    userSelect: "none"
  }
});
