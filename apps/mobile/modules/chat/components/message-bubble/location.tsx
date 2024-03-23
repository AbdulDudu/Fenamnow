import { HEIGHT } from "@/lib/utils/constants";
import { Box, Pressable } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { createOpenLink } from "react-native-open-maps";

export default function LocationMessage({ content }: any) {
  return (
    <Box width={HEIGHT * 0.25} rounded="$lg" height={HEIGHT * 0.2}>
      <Pressable
        onPress={createOpenLink({
          latitude: JSON.parse(content).latitude!,
          longitude: JSON.parse(content).longitude!
        })}
      >
        <Image
          contentFit="cover"
          style={{
            width: "100%",
            borderRadius: 4,
            height: "100%"
          }}
          alt="Location"
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${JSON.parse(content).latitude},${JSON.parse(content).longitude}&zoom=13&size=400x400&markers=color:red%7Clabel:S%7C${JSON.parse(content).latitude},${JSON.parse(content).longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY}`
          }}
        />
      </Pressable>
    </Box>
  );
}
