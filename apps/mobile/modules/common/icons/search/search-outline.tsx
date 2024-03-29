import { createIcon } from "@gluestack-ui/themed";
import { Defs, G, Mask, Path } from "react-native-svg";

export const SearchOutlineIcon = createIcon({
  viewBox: "0 0 48 48",
  path: (
    <>
      <G
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="4"
      >
        <Path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z" />
        <Path
          stroke-linecap="round"
          d="M26.657 14.343A7.975 7.975 0 0 0 21 12a7.975 7.975 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"
        />
      </G>
    </>
  )
});
