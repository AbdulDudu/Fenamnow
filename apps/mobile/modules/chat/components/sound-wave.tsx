import { flex, sizes } from "@/modules/common/ui/global";
import { HStack, View } from "@gluestack-ui/themed";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

type Props = {
  assetUrl: string;
  isMyMessage: boolean;
  currentPositionInSeconds: number;
  currentDurationInSeconds: number;
};

const BAR_AMOUNT = 64;
const BAR_MAX_SIZE = 34;

export default ({
  assetUrl,
  isMyMessage,
  currentPositionInSeconds,
  currentDurationInSeconds
}: Props) => {
  const progressionPercentage = useMemo(
    () => (currentPositionInSeconds / currentDurationInSeconds) * 100,
    [currentDurationInSeconds, currentPositionInSeconds]
  );

  const wavePattern = useMemo(
    () => ({
      id: assetUrl,
      items: new Array(BAR_AMOUNT)
        .fill(null)
        .map((_, i) => Math.round(Math.random() * BAR_MAX_SIZE) + 2)
    }),
    [assetUrl]
  );

  return (
    <View style={styles.container}>
      <GeneratedWave
        assetUrl={assetUrl}
        progressionPercentage={progressionPercentage}
        wavePattern={wavePattern}
      />
      <View
        position="absolute"
        rounded="$full"
        width="$3"
        height="$3"
        backgroundColor={isMyMessage ? "$secondary400" : "$primary400"}
        left={`${progressionPercentage - 2.5}%`}
      />
    </View>
  );
};

type GeneratedWaveProps = Pick<Props, "assetUrl"> & {
  progressionPercentage: number;
  wavePattern: {
    id: string;
    items: number[];
  };
};

const GeneratedWave = React.memo(
  ({ assetUrl, progressionPercentage, wavePattern }: GeneratedWaveProps) => {
    return (
      <HStack
        key={assetUrl}
        flex={1}
        alignItems="center"
        justifyContent="space-between"
      >
        {wavePattern.items.map((height, i) => {
          const alpha =
            progressionPercentage >= ((i + 1) / BAR_AMOUNT) * 100 ? 0.75 : 0.5;
          return (
            <View
              key={i}
              width="$0.5"
              height={height}
              backgroundColor={`rgba(112,112,112,${alpha})`}
            />
          );
        })}
      </HStack>
    );
  }
);

export const colors = {
  dark: {
    primary: "#035B49FF",
    primaryLight: "#12a383",
    primaryTransparent: "#87BFB8FF",
    primaryDark: "#064F40FF",
    secondary: "#222b34",
    secondaryLight: "#859299",
    text: "#dce7eb",
    background: "#0a1519",
    highlighted: "#1a2427",
    transparentPrimary: "rgba(255,255,255,0.5)",
    primaryLightTransparent: "rgba(3,91,73,0.6)",
    border: "#323b40",
    danger: "#D3514CFF",
    active: "#52b9e3"
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: sizes.xl,
    paddingVertical: sizes.s
  },
  progressBall: {
    position: "absolute",
    width: sizes.ml,
    height: sizes.ml,
    borderRadius: sizes.l
  }
});
