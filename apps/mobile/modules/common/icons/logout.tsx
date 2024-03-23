import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const LogoutIcon = createIcon({
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        fill="currentColor"
        d="m19 10l-6-5v3H6v4h7v3zM3 3h8V1H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H3z"
      />
    </>
  )
});
