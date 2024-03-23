import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const SavedIcon = createIcon({
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        fill="currentColor"
        d="M16 2H8C6.3 2 5 3.3 5 5v16c0 .2 0 .3.1.5c.3.5.9.6 1.4.4l5.5-3.2l5.5 3.2c.2.1.3.1.5.1c.6 0 1-.4 1-1V5c0-1.7-1.3-3-3-3z"
      />
    </>
  )
});
