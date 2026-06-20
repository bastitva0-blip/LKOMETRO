import { stations, Station, getStationOptions } from "@/data/metroData";
import { haversineDistanceKm } from "@/lib/utils";

export interface NearestStationResult {
  station: Station;
  distanceKm: number;
  walkingMinutes: number;
}

// Average comfortable walking speed for "minutes to station" estimates.
const WALKING_SPEED_KMH = 4.5;

/**
 * Find the closest operational station to a given [lat, lng] point.
 * WIP (Blue Line) stations are excluded since you can't board a train there yet.
 */
export const findNearestStation = (coordinates: [number, number]): NearestStationResult | null => {
  const candidates = getStationOptions(false); // operational only
  if (candidates.length === 0) return null;

  let best: NearestStationResult | null = null;

  for (const station of candidates) {
    const distanceKm = haversineDistanceKm(coordinates, station.coordinates);
    if (!best || distanceKm < best.distanceKm) {
      best = {
        station,
        distanceKm,
        walkingMinutes: Math.round((distanceKm / WALKING_SPEED_KMH) * 60),
      };
    }
  }

  return best;
};

/** Find the N closest operational stations, sorted nearest-first. */
export const findNearbyStations = (coordinates: [number, number], count = 3): NearestStationResult[] => {
  return getStationOptions(false)
    .map((station) => {
      const distanceKm = haversineDistanceKm(coordinates, station.coordinates);
      return { station, distanceKm, walkingMinutes: Math.round((distanceKm / WALKING_SPEED_KMH) * 60) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, count);
};
