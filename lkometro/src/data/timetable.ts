import { LINE_TERMINALS, stations } from "./metroData";
import {
  LINE_TIMINGS,
  PEAK_HEADWAY_MINUTES,
  OFF_PEAK_HEADWAY_MINUTES,
} from "./segmentTimings";
import { getISTDate, formatMinutesToTime, parseTimeToMinutes } from "@/lib/utils";

export interface TrainSchedule {
  id: string;
  line: "red" | "blue";
  direction: "forward" | "backward";
  startTime: string; // HH:MM, time the train departs the first station
  stations: string[]; // station IDs in order for this run
  stationTimes: number[]; // minutes from startTime for each station
}

export const OPERATING_HOURS = {
  firstTrain: "06:00",
  lastTrain: "22:00",
};

/**
 * Generate a full day's worth of train schedules for a line, in both
 * directions, using the headway rules:
 *   - Peak (8–11, 17–20 on weekdays): 5 min 30 sec
 *   - Off-peak: ~8 min
 *
 * This is a simulated timetable (no official UPMRC departure-time data was
 * provided). It is internally consistent — fare, ETA, and live tracking all
 * derive from the same generated schedule — and can be swapped for a real
 * timetable later without touching any consuming UI code.
 */
const generateLineSchedules = (line: "red" | "blue"): TrainSchedule[] => {
  const timing = LINE_TIMINGS[line];
  const forwardStations = timing.stations;
  const backwardStations = [...forwardStations].reverse();
  const backwardCumulative = (() => {
    const total = timing.cumulativeMinutes[timing.cumulativeMinutes.length - 1];
    return timing.cumulativeMinutes.map((m) => total - m).reverse();
  })();

  const firstMin = parseTimeToMinutes(OPERATING_HOURS.firstTrain);
  const lastMin = parseTimeToMinutes(OPERATING_HOURS.lastTrain);

  const schedules: TrainSchedule[] = [];

  for (const direction of ["forward", "backward"] as const) {
    let t = firstMin;
    let seq = 0;
    while (t <= lastMin) {
      const hourNow = Math.floor(t / 60);
      const isPeak = (hourNow >= 8 && hourNow < 11) || (hourNow >= 17 && hourNow < 20);
      const headway = isPeak ? PEAK_HEADWAY_MINUTES : OFF_PEAK_HEADWAY_MINUTES;

      schedules.push({
        id: `${line.toUpperCase()}-${direction === "forward" ? "F" : "B"}-${seq}`,
        line,
        direction,
        startTime: formatMinutesToTime(t),
        stations: direction === "forward" ? forwardStations : backwardStations,
        stationTimes: direction === "forward" ? timing.cumulativeMinutes : backwardCumulative,
      });

      t += headway;
      seq++;
    }
  }

  return schedules;
};

export const trainSchedules: TrainSchedule[] = [
  ...generateLineSchedules("red"),
  // Blue Line is under construction — schedules are generated but flagged
  // and excluded from live tracking / route planning until it opens.
  ...generateLineSchedules("blue"),
];

export const lineStations: Record<"red" | "blue", string[]> = {
  red: LINE_TIMINGS.red.stations,
  blue: LINE_TIMINGS.blue.stations,
};

export const lineInfo = {
  red: {
    name: "Red Line",
    color: "#9F1239",
    from: LINE_TERMINALS.red.start,
    to: LINE_TERMINALS.red.end,
    distance: "22.87 km",
    travelTime: "40 min",
    firstTrain: OPERATING_HOURS.firstTrain,
    lastTrain: OPERATING_HOURS.lastTrain,
    frequency: `Peak: ${PEAK_HEADWAY_MINUTES} min, Off-peak: ${OFF_PEAK_HEADWAY_MINUTES} min`,
    status: "operational" as const,
  },
  blue: {
    name: "Blue Line",
    color: "#1E5F8C",
    from: LINE_TERMINALS.blue.start,
    to: LINE_TERMINALS.blue.end,
    distance: "11.17 km",
    travelTime: `~${Math.round(LINE_TIMINGS.blue.totalMinutes)} min (est.)`,
    firstTrain: OPERATING_HOURS.firstTrain,
    lastTrain: OPERATING_HOURS.lastTrain,
    frequency: "TBD — under construction",
    status: "under_construction" as const,
  },
};

// ───────────────────────────── Single-line route engine ─────────────────────────────
// Lucknow Metro currently has one operational corridor, so route planning is a simple
// "slice the ordered station list" operation rather than the multi-line Dijkstra graph
// search Ahmedabad needs. This keeps the v1 engine small while staying line-aware so a
// second line (Blue) can be added without a rewrite — see lib/routePlanner.ts.

const getCurrentTimeMinutes = (): number => {
  const now = getISTDate();
  return now.getHours() * 60 + now.getMinutes();
};

/** Find the next train serving a station, heading toward a given destination, after a given time. */
export const findNextTrain = (
  stationId: string,
  destId: string,
  afterMinutes: number = getCurrentTimeMinutes()
): { schedule: TrainSchedule; departureMinutes: number; arrivalMinutes: number } | null => {
  const candidates: { schedule: TrainSchedule; departureMinutes: number; arrivalMinutes: number }[] = [];

  for (const schedule of trainSchedules) {
    const fromIdx = schedule.stations.indexOf(stationId);
    const toIdx = schedule.stations.indexOf(destId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) continue;

    const startMinutes = parseTimeToMinutes(schedule.startTime);
    const departureMinutes = startMinutes + schedule.stationTimes[fromIdx];
    const arrivalMinutes = startMinutes + schedule.stationTimes[toIdx];

    if (departureMinutes >= afterMinutes) {
      candidates.push({ schedule, departureMinutes, arrivalMinutes });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.departureMinutes - b.departureMinutes);
  return candidates[0];
};

/** Get the next N upcoming trains at a station (Red Line only — the operational line). */
export const getUpcomingTrains = (
  stationId: string,
  count = 4,
  afterMinutes: number = getCurrentTimeMinutes()
): { schedule: TrainSchedule; departureMinutes: number; direction: "forward" | "backward" }[] => {
  const results: { schedule: TrainSchedule; departureMinutes: number; direction: "forward" | "backward" }[] = [];

  for (const schedule of trainSchedules) {
    if (schedule.line !== "red") continue; // only Red Line is operational
    const idx = schedule.stations.indexOf(stationId);
    if (idx === -1 || idx === schedule.stations.length - 1) continue;

    const startMinutes = parseTimeToMinutes(schedule.startTime);
    const departureMinutes = startMinutes + schedule.stationTimes[idx];
    if (departureMinutes >= afterMinutes) {
      results.push({ schedule, departureMinutes, direction: schedule.direction });
    }
  }

  results.sort((a, b) => a.departureMinutes - b.departureMinutes);
  return results.slice(0, count);
};

/** Compute a live train's current position (interpolated) given the current time. */
export const getTrainPosition = (
  schedule: TrainSchedule,
  currentMinutes: number
): {
  status: "not_started" | "in_transit" | "at_station" | "completed";
  coordinates?: [number, number];
  currentStationId?: string;
  nextStationId?: string;
  progress?: number; // 0–1 between current and next station
} => {
  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const elapsedMinutes = currentMinutes - startMinutes;
  const totalMinutes = schedule.stationTimes[schedule.stationTimes.length - 1];

  if (elapsedMinutes < 0) return { status: "not_started" };
  if (elapsedMinutes >= totalMinutes) return { status: "completed" };

  for (let i = 0; i < schedule.stationTimes.length - 1; i++) {
    const segStart = schedule.stationTimes[i];
    const segEnd = schedule.stationTimes[i + 1];

    if (elapsedMinutes >= segStart && elapsedMinutes < segEnd) {
      const fromStation = stations[schedule.stations[i]];
      const toStation = stations[schedule.stations[i + 1]];
      if (!fromStation || !toStation) return { status: "in_transit" };

      const segDuration = segEnd - segStart;
      const progress = segDuration > 0 ? (elapsedMinutes - segStart) / segDuration : 0;

      if (progress < 0.08) {
        return {
          status: "at_station",
          currentStationId: fromStation.id,
          coordinates: fromStation.coordinates,
          progress: 0,
        };
      }

      const lat = fromStation.coordinates[0] + (toStation.coordinates[0] - fromStation.coordinates[0]) * progress;
      const lng = fromStation.coordinates[1] + (toStation.coordinates[1] - fromStation.coordinates[1]) * progress;

      return {
        status: "in_transit",
        coordinates: [lat, lng],
        currentStationId: fromStation.id,
        nextStationId: toStation.id,
        progress,
      };
    }
  }

  return { status: "completed" };
};

/** Get all currently-running trains (for the live tracking map). Red Line only — operational. */
export const getActiveTrains = (
  currentMinutes: number = getCurrentTimeMinutes()
): { schedule: TrainSchedule; position: ReturnType<typeof getTrainPosition> }[] => {
  return trainSchedules
    .filter((s) => s.line === "red")
    .map((schedule) => ({ schedule, position: getTrainPosition(schedule, currentMinutes) }))
    .filter((t) => t.position.status === "in_transit" || t.position.status === "at_station");
};
