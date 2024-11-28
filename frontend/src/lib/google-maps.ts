import { decode } from "@googlemaps/polyline-codec";

export const decodePolyline = (encodedPolyline: string) => {
  return decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
};