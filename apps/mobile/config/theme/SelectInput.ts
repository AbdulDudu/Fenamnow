import { createStyle } from "@gluestack-style/react";

export const SelectInput = createStyle({
  _web: {
    w: "$full"
  },
  fontFamily: "NotoSans_500Medium",
  textTransform: "capitalize",
  pointerEvents: "none",
  flex: 1,
  h: "$full",
  color: "$textLight900",
  props: {
    placeholderTextColor: "$textLight500"
  },
  _dark: {
    color: "$textDark50",
    props: {
      placeholderTextColor: "$textDark400"
    }
  }
});
