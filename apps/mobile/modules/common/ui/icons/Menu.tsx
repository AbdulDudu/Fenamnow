import React from "react";
import { IconProps, RootPath, RootSvg } from "stream-chat-expo";

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
      {...props}
    />
  </RootSvg>
);
