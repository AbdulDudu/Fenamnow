import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const VideoIcon = createIcon({
  viewBox: "0 0 20 20",
  path: (
    <>
      <Path
        fill="currentColor"
        d="M20 5V3.799A.798.798 0 0 0 19.201 3H.801A.8.8 0 0 0 0 3.799V5h2v2H0v2h2v2H0v2h2v2H0v1.199A.8.8 0 0 0 .801 17h18.4a.8.8 0 0 0 .799-.801V15h-2v-2h2v-2h-2V9h2V7h-2V5zM8 13V7l5 3z"
      />
    </>
  )
});
