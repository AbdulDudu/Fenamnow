import { HEIGHT } from "@/lib/utils/constants";
import { Center, Text } from "@gluestack-ui/themed";

export default function EmptyList({ text }: { text?: string }) {
  return (
    <Center flex={1} height={HEIGHT * 0.75}>
      <Text fontSize="$lg" semibold>
        {text || "No results found"}
      </Text>
    </Center>
  );
}
