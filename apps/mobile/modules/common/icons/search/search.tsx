import { createIcon } from "@gluestack-ui/themed";
import { Defs, G, Mask, Path } from "react-native-svg";

export const SearchIcon = createIcon({
  viewBox: "0 0 48 48",
  path: (
    <>
      <Defs>
        <Mask id="ipSSearch0">
          <G fill="none" stroke-linejoin="round" stroke-width="4">
            <Path
              fill="#fff"
              stroke="#fff"
              d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"
            />
            <Path
              stroke="currentColor"
              stroke-linecap="round"
              d="M26.657 14.343A7.975 7.975 0 0 0 21 12a7.975 7.975 0 0 0-5.657 2.343"
            />
            <Path
              stroke="#fff"
              stroke-linecap="round"
              d="m33.222 33.222l8.485 8.485"
            />
          </G>
        </Mask>
      </Defs>
      <Path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSSearch0)" />
    </>
  )
});
