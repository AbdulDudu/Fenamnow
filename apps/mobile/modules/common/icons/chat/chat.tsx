import { createIcon } from "@gluestack-ui/themed";
import { Path, Rect } from "react-native-svg";

export const ChatIcon = createIcon({
  viewBox: "0 0 256 256",
  path: (
    <>
      <Path
        fill="currentColor"
        d="M232 64v128a16 16 0 0 1-16 16H82.5l-32.08 28.11a.69.69 0 0 1-.13.11A15.89 15.89 0 0 1 40 240a16.05 16.05 0 0 1-6.79-1.52A15.84 15.84 0 0 1 24 224V64a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16Z"
      />
    </>
  )
});
