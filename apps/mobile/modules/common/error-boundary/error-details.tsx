import {
  Button,
  ButtonText,
  Heading,
  Text,
  View,
  VStack
} from "@gluestack-ui/themed";
import React, { ErrorInfo } from "react";
import { Screen } from "../ui/screen";

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen>
      <VStack flex={1} alignItems="center">
        <View>
          <Heading>Something went wrong</Heading>
          <Text>{props.error.message}</Text>
        </View>

        <Button onPress={() => props.onReset()}>
          <ButtonText>Go back</ButtonText>
        </Button>
      </VStack>
    </Screen>
  );
}

// export function ErrorBoundary(props: ErrorBoundaryProps) {
//   return (
//     <View style={{ flex: 1, backgroundColor: "red" }}>
//       <Text>{props.error.message}</Text>
//       <Text onPress={props.retry}>Try Again?</Text>
//     </View>
//   );
// }
