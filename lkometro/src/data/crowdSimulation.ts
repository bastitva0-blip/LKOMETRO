import { getISTDate } from "@/lib/utils";

export type CrowdLevel = "low" | "moderate" | "heavy";

export interface CrowdInfo {
  level: CrowdLevel;
  label: string;
  emoji: string;
  textClass: string;
  bgClass: string;
}

export const CROWD_LEVELS: Record<CrowdLevel, CrowdInfo> = {
  low: {
    level: "low",
    label: "Low",
    emoji: "🟢",
    textClass: "text-success",
    bgClass: "bg-success/15",
  },
  moderate: {
    level: "moderate",
    label: "Moderate",
    emoji: "🟡",
    textClass: "text-warning",
    bgClass: "bg-warning/15",
  },
  heavy: {
    level: "heavy",
    label: "Crowded",
    emoji: "🔴",
    textClass: "text-destructive",
    bgClass: "bg-destructive/15",
  },
};

// Peak hours: 8–11 AM and 5–8 PM on weekdays
export const isPeakHour = (date: Date = getISTDate()): boolean => {
  const hour = date.getHours();
  const day = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  if (!isWeekday) return false;
  return (hour >= 8 && hour < 11) || (hour >= 17 && hour < 20);
};

export const isWeekend = (date: Date = getISTDate()): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Stations that see disproportionately heavy footfall regardless of time
// (interchange hub, CBD/shopping district, secretariat/government offices).
const HIGH_FOOTFALL_STATIONS = new Set([
  "charbagh", // rail + bus interchange hub
  "hazratganj", // CBD / shopping district
  "sachivalaya", // UP Secretariat — heavy on weekday office hours
  "alambagh", // bus stand vicinity
  "indira_nagar", // dense residential catchment
]);

// Stations that stay quiet most of the day (airport security buffer, edge
// residential stops with lower density).
const LOW_FOOTFALL_STATIONS = new Set([
  "ccs_airport",
  "amausi",
  "krishna_nagar",
  "mawaiya",
]);

/**
 * Estimate crowd level at a station for a given time. This is a simulation
 * derived from the line's 87,000 average daily ridership and known
 * high-footfall nodes (Charbagh interchange, Hazratganj CBD, Sachivalaya
 * secretariat) — not live sensor data.
 */
export const getStationCrowdLevel = (
  stationId: string,
  date: Date = getISTDate()
): CrowdInfo => {
  const peak = isPeakHour(date);
  const weekend = isWeekend(date);
  const highFootfall = HIGH_FOOTFALL_STATIONS.has(stationId);
  const lowFootfall = LOW_FOOTFALL_STATIONS.has(stationId);

  let level: CrowdLevel;

  if (highFootfall) {
    level = peak ? "heavy" : weekend ? "moderate" : "moderate";
  } else if (lowFootfall) {
    level = peak ? "moderate" : "low";
  } else {
    level = peak ? "moderate" : weekend ? "low" : "low";
  }

  return CROWD_LEVELS[level];
};

/**
 * Estimate crowd level on board a specific train, factoring in how far
 * along its run it is (trains fill up approaching the CBD core and empty
 * out after Hazratganj/Charbagh).
 */
export const getTrainCrowdLevel = (
  progressThroughCoreSection: number, // 0–1, 1 = deep in Charbagh–Hazratganj core
  date: Date = getISTDate()
): CrowdInfo => {
  const peak = isPeakHour(date);
  if (peak && progressThroughCoreSection > 0.4) return CROWD_LEVELS.heavy;
  if (progressThroughCoreSection > 0.6) return CROWD_LEVELS.moderate;
  if (peak) return CROWD_LEVELS.moderate;
  return CROWD_LEVELS.low;
};

export const DAILY_RIDERSHIP = 87000;
