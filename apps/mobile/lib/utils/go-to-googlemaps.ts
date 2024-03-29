import * as Linking from "expo-linking";

export const goToGoogleMaps = (lat?: number, long?: number) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;

  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URI: ${url}`);
    }
  });
};
export const prepareStaticMapUrl = (lat?: number, long?: number) => {
  let baseURL = "https://maps.googleapis.com/maps/api/staticmap?";
  let url = new URL(baseURL);
  let params = url.searchParams;
  params.append("center", `${lat},${long}`);
  params.append("zoom", "15");
  params.append("size", "600x300");
  params.append("maptype", "roadmap");
  params.append("key", process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY!);
  params.append("markers", `color:red|${lat},${long}`);

  return url.toString();
};
