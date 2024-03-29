import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { IconProps, RootPath, RootSvg } from "stream-chat-expo";

const RecordBlinking = () => {
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
        <Mic pathFill="#D3514CFF" width={24} height={24} />
      </View>
    </Animated.View>
  );
};

export const Mic = (props: IconProps) => (
  <RootSvg {...props} viewBox="0 0 24 24">
    <RootPath
      d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
      {...props}
    />
  </RootSvg>
);

const globalStyles = StyleSheet.create({
  iconWrap: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 24
  }
});
export default RecordBlinking;
