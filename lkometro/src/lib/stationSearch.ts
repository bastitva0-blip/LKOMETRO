import { Station, getStationOptions, stations } from "@/data/metroData";
import { LocalPlace, searchLocalPlaces } from "@/data/localPlaces";

export interface SearchResult {
  type: "station" | "landmark";
  id: string;
  label: string;
  sublabel?: string;
  station?: Station;
  landmark?: LocalPlace;
}

/** Fuzzy, offline search across stations and landmarks, ranked by relevance. */
export const searchAll = (query: string, limit = 8): SearchResult[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const stationResults: SearchResult[] = getStationOptions()
    .filter((s) => s.name.toLowerCase().includes(q))
    .map((s) => ({
      type: "station" as const,
      id: s.id,
      label: s.name,
      sublabel: s.isUnderground ? "Underground station" : "Station",
      station: s,
    }));

  const landmarkResults: SearchResult[] = searchLocalPlaces(q, limit).map((p) => ({
    type: "landmark" as const,
    id: p.id,
    label: p.name,
    sublabel: `Nearest: ${stations[p.nearestStationId]?.name ?? ""} · ${p.distanceKm} km`,
    landmark: p,
  }));

  // Prioritize exact-prefix station matches, then other stations, then landmarks.
  const prefixMatches = stationResults.filter((r) => r.label.toLowerCase().startsWith(q));
  const otherStationMatches = stationResults.filter((r) => !r.label.toLowerCase().startsWith(q));

  return [...prefixMatches, ...otherStationMatches, ...landmarkResults].slice(0, limit);
};
