export const prepareStaticMapUrl = (lat?: number, long?: number) => {
  let baseURL = "https://maps.googleapis.com/maps/api/staticmap?";
  let url = new URL(baseURL);
  let params = url.searchParams;
  params.append("center", `${lat},${long}`);
  params.append("zoom", "15");
  params.append("size", "600x300");
  params.append("maptype", "roadmap");
  params.append("key", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);
  params.append("markers", `color:red|${lat},${long}`);

  return url.toString();
};
