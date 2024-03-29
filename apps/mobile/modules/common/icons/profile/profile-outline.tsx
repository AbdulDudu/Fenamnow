import { createIcon } from "@gluestack-ui/themed";
import { Circle, G, Path } from "react-native-svg";

export const ProfileOutlineIcon = createIcon({
  viewBox: "0 0 24 24",
  path: (
    <>
      <G fill="none" stroke="currentColor" stroke-width="1.5">
        <Path
          stroke-linejoin="round"
          d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
        />
        <Circle cx="12" cy="7" r="3" />
      </G>
    </>
  )
});
