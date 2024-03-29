import { AnimatedView as GSAnimatedView } from "@gluestack-style/animation-resolver";
import { styled } from "@gluestack-style/react";

export const AnimatedView = styled(GSAnimatedView, {
  ":initial": { opacity: 0 },
  ":animate": { opacity: 1, x: 0 },
  ":exit": { opacity: 0 }
});

export const BlinkingView = styled(GSAnimatedView, {
  ":initial": { opacity: 0 },
  ":animate": { opacity: 1, x: 0 },
  ":exit": { opacity: 0 }
});
