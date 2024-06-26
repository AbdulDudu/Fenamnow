import React from "react";
import { IconProps, RootPath, RootSvg } from "stream-chat-expo";

export default (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 28 28">
    <RootPath
      d="M5.25 5.5C3.45507 5.5 2 6.95508 2 8.75V19.25C2 21.0449 3.45507 22.5 5.25 22.5H14.75C16.5449 22.5 18 21.0449 18 19.25V8.75C18 6.95507 16.5449 5.5 14.75 5.5H5.25Z"
      {...props}
    />
    <RootPath
      d="M23.1232 20.6431L19.5 17.0935V10.9989L23.1121 7.3706C23.8988 6.58044 25.248 7.13753 25.248 8.25251V19.7502C25.248 20.8577 23.9143 21.4181 23.1232 20.6431Z"
      {...props}
    />
  </RootSvg>
);
