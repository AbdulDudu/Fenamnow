import { createIcon } from "@gluestack-ui/themed";
import { Circle, Path } from "react-native-svg";

export const MoreIcon = createIcon({
  viewBox: "0 0 24 24",
  path: (
    <>
      <Circle cx="12" cy="12" r="2" fill="currentColor" />
      <Circle cx="12" cy="5" r="2" fill="currentColor" />
      <Circle cx="12" cy="19" r="2" fill="currentColor" />
    </>
  )
});
