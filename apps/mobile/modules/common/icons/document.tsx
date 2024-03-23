import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

export const DocumentIcon = createIcon({
  viewBox: "0 0 1024 1024",
  path: (
    <>
      <Path
        fill="currentColor"
        d="M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"
      />
    </>
  )
});
