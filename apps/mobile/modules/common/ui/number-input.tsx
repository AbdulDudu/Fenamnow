import { Button, ButtonIcon, HStack, Text } from "@gluestack-ui/themed";
import { MinusIcon, PlusIcon } from "lucide-react-native";
import React from "react";

export default function NumberInput({
  value,
  increase,
  decrease
}: {
  value: number | null;
  increase: () => void | null;
  decrease: () => void | null;
}) {
  return (
    <HStack
      width="40%"
      alignItems="center"
      h="$10"
      justifyContent="space-between"
    >
      <Button isDisabled={!value || value == 0} size="sm" onPress={decrease}>
        <ButtonIcon as={MinusIcon} />
      </Button>
      <Text semibold>{value !== null && value >= 0 ? value : "?"}</Text>
      <Button size="sm" onPress={increase}>
        <ButtonIcon as={PlusIcon} />
      </Button>
    </HStack>
  );
}
