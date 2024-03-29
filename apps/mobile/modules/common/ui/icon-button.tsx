import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { globalStyles, sizes } from "./global";
import ArrowLeft from "./icons/ArrowLeft";
import Attachment from "./icons/Attachment";
import Call from "./icons/Call";
import Camera from "./icons/Camera";
import CircleClose from "./icons/CircleClose";
import Images from "./icons/Images";
import MagnifyingGlass from "./icons/MagnifyingGlass";
import Menu from "./icons/Menu";
import Mic from "./icons/Mic";
import Muted from "./icons/Muted";
import Pause from "./icons/Pause";
import Pin from "./icons/Pin";
import Play from "./icons/Play";
import ReplyArrow from "./icons/ReplyArrow";
import Send from "./icons/Send";
import Smiley from "./icons/Smiley";
import Star from "./icons/Star";
import Trash from "./icons/Trash";
import Unstar from "./icons/Unstar";
import Video from "./icons/Video";

const iconNameToComponentLookUp = {
  Video,
  Menu,
  Call,
  ArrowLeft,
  Smiley,
  Camera,
  Attachment,
  Send,
  Mic,
  MagnifyingGlass,
  CircleClose,
  ReplyArrow,
  Play,
  Pause,
  Pin,
  Trash,
  Images,
  Star,
  Unstar,
  Muted
};

interface IconButtonProps extends PressableProps {
  usePressable?: boolean;
  isEnabled?: boolean;
  iconName: keyof typeof iconNameToComponentLookUp;
  pathFill: string;
  onPress?: PressableProps["onPress"];
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default ({
  isEnabled = true,
  usePressable = false,
  iconName,
  pathFill = "#859299",
  style = {},
  width = sizes.xl,
  height = sizes.xl,
  ...props
}: IconButtonProps) => {
  if (!isEnabled) return null;

  const IconComponent = iconNameToComponentLookUp[iconName] || null;
  const content = (
    <IconComponent pathFill={pathFill} width={width} height={height} />
  );
  if (usePressable)
    return (
      <Pressable
        {...props}
        style={{ ...globalStyles.iconWrap, ...(style as object) }}
      >
        {content}
      </Pressable>
    );

  return (
    <Pressable
      onPress={props.onPress}
      style={{ ...globalStyles.iconWrap, ...(style as object) }}
    >
      {content}
    </Pressable>
  );
};
