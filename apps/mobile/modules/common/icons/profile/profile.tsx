import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const ProfileIcon = createIcon({
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        fill="currentColor"
        fill-rule="evenodd"
        d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
        clip-rule="evenodd"
      />
    </>
  )
});
