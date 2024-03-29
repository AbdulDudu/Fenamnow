export function findMapCenter(
  coordinates: { latitude: number; longitude: number }[]
): { lat: number; lng: number } | null {
  if (coordinates.length === 0) {
    return null;
  }

  const total = coordinates.reduce(
    (acc, cur) => {
      return {
        latitude: acc.latitude + cur.latitude,
        longitude: acc.longitude + cur.longitude
      };
    },
    { latitude: 0, longitude: 0 }
  );

  return {
    lat: total.latitude / coordinates.length,
    lng: total.longitude / coordinates.length
  };
}
