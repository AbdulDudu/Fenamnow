import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const CirclePlusIcon = createIcon({
  viewBox: "0 0 50 50",
  path: (
    <>
      <Path
        fill="currentColor"
        d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
      />
      <Path fill="currentColor" d="M16 24h18v2H16z" />
      <Path fill="currentColor" d="M24 16h2v18h-2z" />
    </>
  )
});
