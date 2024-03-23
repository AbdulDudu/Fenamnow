import { styled } from "@gluestack-style/react";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = styled(SafeAreaView, {
  paddingHorizontal: 16,
  _dark: {
    backgroundColor: "$black"
  },
  _light: {
    backgroundColor: "$secondary200"
  },
  flex: 1
});
