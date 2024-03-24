import { HStack, Text, View } from "@gluestack-ui/themed";
import React, { useMemo } from "react";

type Props = {
  assetUrl: string;
  isMyMessage: boolean;
  currentPositionInSeconds: number;
  currentDurationInSeconds: number;
};

type GeneratedWaveProps = Pick<Props, "assetUrl"> & {
  progressionPercentage: number;
  wavePattern: {
    id: string;
    items: number[];
  };
};

const BAR_AMOUNT = 64;
const BAR_MAX_SIZE = 34;

export default function SoundWave({
  assetUrl,
  isMyMessage,
  currentPositionInSeconds,
  currentDurationInSeconds
}: Props) {
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
    <View flex={1} justifyContent="center" height="$24" px="$4">
      <GeneratedWave
        assetUrl={assetUrl}
        progressionPercentage={progressionPercentage}
        wavePattern={wavePattern}
      />
      <View
        position="absolute"
        width="$12"
        height="$12"
        rounded="$full"
        backgroundColor={isMyMessage ? "$primary500" : "$secondary500"}
        left={`${progressionPercentage}%`}
      />
    </View>
  );
}

const GeneratedWave = React.memo(
  ({ assetUrl, progressionPercentage, wavePattern }: GeneratedWaveProps) => {
    return (
      <HStack key={assetUrl} alignItems="center">
        {wavePattern.items.map((height, i) => {
          const alpha =
            progressionPercentage >= ((i + 1) / BAR_AMOUNT) * 100 ? 0.75 : 0.25;
          return (
            <View
              key={i}
              width="$1"
              rounded="$lg"
              backgroundColor="$primary500"
              mx="$0.5"
              style={{
                height,
                backgroundColor: `rgba(180,180,180, ${alpha})`
              }}
            />
          );
        })}
      </HStack>
    );
  }
);
