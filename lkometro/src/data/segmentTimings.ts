import { LINE_STATIONS } from "./metroData";

/**
 * Travel-time engine for the Red Line.
 *
 * Official anchor: CCS Airport → Munshipulia runtime = 40 minutes
 * (per UPMRC). Per-segment moving time is distributed proportionally to
 * straight-line distance between stations, then dwell time is added back
 * at each intermediate stop (45s normal, 70s at the three underground
 * stations where doors stay open longer) so the cumulative total lands
 * exactly on the official 40-minute figure.
 */

export const NORMAL_DWELL_SEC = 45;
export const UNDERGROUND_DWELL_SEC = 70;

export const UNDERGROUND_STATION_IDS = new Set([
  "hussainganj",
  "sachivalaya",
  "hazratganj",
]);

export const RED_LINE_TOTAL_MINUTES = 40;
export const PEAK_HEADWAY_MINUTES = 5.5; // 5 min 30 sec
export const OFF_PEAK_HEADWAY_MINUTES = 8;
export const AVERAGE_SPEED_KMH = 33; // 32–34 km/h per official spec

/** Cumulative arrival time (minutes from departure at CCS Airport) at each Red Line station. */
export const RED_LINE_CUMULATIVE_MINUTES: number[] = [
  0, 2.65, 5.35, 7.66, 10.1, 12.31, 14.02, 15.86, 17.96, 19.57, 23.0, 25.24,
  27.2, 28.8, 30.14, 31.72, 33.31, 35.01, 36.9, 38.95, 40.0,
];

export interface LineTiming {
  stations: string[];
  cumulativeMinutes: number[];
  totalMinutes: number;
}

export const LINE_TIMINGS: Record<"red" | "blue", LineTiming> = {
  red: {
    stations: LINE_STATIONS.red,
    cumulativeMinutes: RED_LINE_CUMULATIVE_MINUTES,
    totalMinutes: RED_LINE_TOTAL_MINUTES,
  },
  // Blue Line is under construction — no official runtime yet. We estimate
  // using the same average speed (33 km/h) and dwell assumptions as Red,
  // scaled to its 11.17 km / 12 station corridor, so the data model is
  // ready the moment UPMRC publishes a real timetable.
  blue: (() => {
    const ids = LINE_STATIONS.blue;
    const segCount = ids.length - 1;
    const estimatedKm = 11.17;
    const avgSegKm = estimatedKm / segCount;
    const movingMinPerSeg = (avgSegKm / AVERAGE_SPEED_KMH) * 60;
    const cumulative: number[] = [0];
    let cum = 0;
    for (let i = 0; i < segCount; i++) {
      cum += movingMinPerSeg;
      if (i < segCount - 1) {
        cum += NORMAL_DWELL_SEC / 60;
      }
      cumulative.push(cum);
    }
    return {
      stations: ids,
      cumulativeMinutes: cumulative,
      totalMinutes: Math.round(cum * 10) / 10,
    };
  })(),
};

/** Travel time in minutes between any two stations on the same line (order-independent). */
export const getTravelTimeMinutes = (
  line: "red" | "blue",
  fromId: string,
  toId: string
): number | null => {
  const timing = LINE_TIMINGS[line];
  const fromIdx = timing.stations.indexOf(fromId);
  const toIdx = timing.stations.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1) return null;
  return Math.abs(timing.cumulativeMinutes[toIdx] - timing.cumulativeMinutes[fromIdx]);
};

/** Number of stations traveled through between two stations (used for fare slabs). */
export const getStationCount = (
  line: "red" | "blue",
  fromId: string,
  toId: string
): number | null => {
  const timing = LINE_TIMINGS[line];
  const fromIdx = timing.stations.indexOf(fromId);
  const toIdx = timing.stations.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1) return null;
  return Math.abs(toIdx - fromIdx);
};

/** Get the headway (minutes between trains) for a given time of day. */
export const getHeadwayMinutes = (date: Date): number => {
  const hour = date.getHours();
  const day = date.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isPeak = isWeekday && ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20));
  return isPeak ? PEAK_HEADWAY_MINUTES : OFF_PEAK_HEADWAY_MINUTES;
};
