import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { globalStyles, sizes } from "../global";
import Mic from "./Mic";

export default () => {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 750, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  const animatedMicStyle = useAnimatedStyle(
    () => ({ opacity: opacity.value }),
    []
  );
  return (
    <Animated.View style={animatedMicStyle}>
      <View style={globalStyles.iconWrap}>
        <Mic pathFill="#D3514CFF" width={sizes.xl} height={sizes.xl} />
      </View>
    </Animated.View>
  );
};
