import { flex, sizes } from "@/modules/common/ui/global";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

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
        style={{
          ...styles.progressBall,
          backgroundColor: isMyMessage
            ? colors.dark.secondaryLight
            : colors.dark.active,
          left: `${progressionPercentage}%`
        }}
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
      <View key={assetUrl} style={flex.directionRowItemsContentCenter}>
        {wavePattern.items.map((height, i) => {
          const alpha =
            progressionPercentage >= ((i + 1) / BAR_AMOUNT) * 100 ? 0.75 : 0.25;
          return (
            <View
              key={i}
              style={{
                ...styles.barItem,
                height,
                backgroundColor: `rgba(255,255,255,${alpha})`
              }}
            />
          );
        })}
      </View>
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
  barItem: {
    width: sizes.xs,
    borderRadius: sizes.l,
    backgroundColor: colors.dark.transparentPrimary,
    marginHorizontal: 0.5
  },
  progressBall: {
    position: "absolute",
    width: sizes.ml,
    height: sizes.ml,
    borderRadius: sizes.l
  }
});
