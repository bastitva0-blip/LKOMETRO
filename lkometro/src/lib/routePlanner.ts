import { stations, Station, LINE_STATIONS, LINE_COLORS } from "@/data/metroData";
import { trainSchedules, TrainSchedule } from "@/data/timetable";
import { calculateFare } from "@/data/fareData";
import { getISTDate, formatMinutesToTime, parseTimeToMinutes } from "@/lib/utils";

export interface RouteStep {
  type: "board" | "travel" | "alight" | "interchange";
  station: Station;
  line?: keyof typeof LINE_COLORS;
  direction?: string;
  stationCount?: number;
  stations?: Station[];
  trainTime?: string;
  trainId?: string;
  waitTime?: number;
}

export interface PlannedRoute {
  origin: Station;
  destination: Station;
  steps: RouteStep[];
  totalStations: number;
  totalTime: number; // minutes
  interchangeCount: number;
  fare: number;
  discountedFare?: number;
  departureTime?: string;
  arrivalTime?: string;
  departureMinutes?: number;
  arrivalMinutes?: number;
  isDirect: boolean;
}

const getCurrentTimeMinutes = (): number => {
  const now = getISTDate();
  return now.getHours() * 60 + now.getMinutes();
};

const getStationLine = (stationId: string): "red" | "blue" | null => {
  for (const line of ["red", "blue"] as const) {
    if (LINE_STATIONS[line].includes(stationId)) return line;
  }
  return null;
};

const getDirection = (line: "red" | "blue", fromIdx: number, toIdx: number): string => {
  const order = LINE_STATIONS[line];
  const terminalEnd = stations[order[order.length - 1]]?.name ?? "";
  const terminalStart = stations[order[0]]?.name ?? "";
  return fromIdx < toIdx ? `towards ${terminalEnd}` : `towards ${terminalStart}`;
};

/**
 * Plan a route between two stations. v1 supports the single operational
 * Red Line as a direct same-line journey. The function is line-aware (not
 * hardcoded to Red), so once the Blue Line opens this naturally extends to
 * a one-interchange route via Charbagh without changing the calling code.
 */
export const planRoute = (
  originId: string,
  destinationId: string,
  hasGoSmartCard = false
): PlannedRoute | null => {
  const origin = stations[originId];
  const destination = stations[destinationId];
  if (!origin || !destination || originId === destinationId) return null;

  const originLine = getStationLine(originId);
  const destLine = getStationLine(destinationId);
  if (!originLine || !destLine) return null;

  // Same-line journey (the only case live in v1, since only Red Line operates)
  if (originLine === destLine) {
    return buildSingleLineRoute(originId, destinationId, originLine, hasGoSmartCard);
  }

  // Cross-line journey via Charbagh interchange (Blue Line not yet operational,
  // but the path-building logic is ready for when it is).
  if (
    LINE_STATIONS[originLine].includes("charbagh") &&
    LINE_STATIONS[destLine].includes("charbagh")
  ) {
    return buildInterchangeRoute(originId, destinationId, originLine, destLine, hasGoSmartCard);
  }

  return null;
};

const buildSingleLineRoute = (
  originId: string,
  destinationId: string,
  line: "red" | "blue",
  hasGoSmartCard: boolean
): PlannedRoute | null => {
  const origin = stations[originId];
  const destination = stations[destinationId];
  const order = LINE_STATIONS[line];
  const fromIdx = order.indexOf(originId);
  const toIdx = order.indexOf(destinationId);
  if (fromIdx === -1 || toIdx === -1) return null;

  const start = Math.min(fromIdx, toIdx);
  const end = Math.max(fromIdx, toIdx);
  const between = order.slice(start + 1, end);
  const betweenStations = (fromIdx < toIdx ? between : [...between].reverse())
    .map((id) => stations[id])
    .filter(Boolean);

  const stationCount = end - start;
  const fare = calculateFare(stationCount, false);
  const discountedFare = hasGoSmartCard ? calculateFare(stationCount, true) : undefined;

  const direction = getDirection(line, fromIdx, toIdx);

  // Find next train, if the line is operational; otherwise show estimated-only.
  const currentMinutes = getCurrentTimeMinutes();
  let trainTime: string | undefined;
  let trainId: string | undefined;
  let departureMinutes: number | undefined;
  let arrivalMinutes: number | undefined;

  if (line === "red") {
    const candidates: { schedule: TrainSchedule; departureMinutes: number; arrivalMinutes: number }[] = [];
    for (const schedule of trainSchedules) {
      if (schedule.line !== "red") continue;
      const sFromIdx = schedule.stations.indexOf(originId);
      const sToIdx = schedule.stations.indexOf(destinationId);
      if (sFromIdx === -1 || sToIdx === -1 || sFromIdx >= sToIdx) continue;
      const startMin = parseTimeToMinutes(schedule.startTime);
      const dep = startMin + schedule.stationTimes[sFromIdx];
      const arr = startMin + schedule.stationTimes[sToIdx];
      if (dep >= currentMinutes) candidates.push({ schedule, departureMinutes: dep, arrivalMinutes: arr });
    }
    candidates.sort((a, b) => a.departureMinutes - b.departureMinutes);
    const best = candidates[0];
    if (best) {
      trainTime = formatMinutesToTime(best.departureMinutes);
      trainId = best.schedule.id;
      departureMinutes = best.departureMinutes;
      arrivalMinutes = best.arrivalMinutes;
    }
  }

  const totalTime =
    arrivalMinutes !== undefined && departureMinutes !== undefined
      ? Math.round(arrivalMinutes - departureMinutes)
      : Math.round(stationCount * 2);

  const steps: RouteStep[] = [
    {
      type: "board",
      station: origin,
      line,
      direction,
      trainTime,
      trainId,
    },
    {
      type: "travel",
      station: destination,
      line,
      stationCount,
      stations: betweenStations,
      trainId,
    },
    {
      type: "alight",
      station: destination,
    },
  ];

  return {
    origin,
    destination,
    steps,
    totalStations: stationCount,
    totalTime,
    interchangeCount: 0,
    fare,
    discountedFare,
    departureTime: trainTime,
    arrivalTime: arrivalMinutes !== undefined ? formatMinutesToTime(arrivalMinutes) : undefined,
    departureMinutes,
    arrivalMinutes,
    isDirect: true,
  };
};

const buildInterchangeRoute = (
  originId: string,
  destinationId: string,
  originLine: "red" | "blue",
  destLine: "red" | "blue",
  hasGoSmartCard: boolean
): PlannedRoute | null => {
  const origin = stations[originId];
  const destination = stations[destinationId];

  const leg1 = buildSingleLineRoute(originId, "charbagh", originLine, hasGoSmartCard);
  const leg2 = buildSingleLineRoute("charbagh", destinationId, destLine, hasGoSmartCard);
  if (!leg1 || !leg2) return null;

  const steps: RouteStep[] = [
    ...leg1.steps.slice(0, -1), // drop the "alight" from leg 1
    {
      type: "interchange",
      station: stations["charbagh"],
      line: destLine,
      direction: getDirection(destLine, 0, LINE_STATIONS[destLine].indexOf(destinationId)),
      waitTime: 4,
    },
    ...leg2.steps.slice(1), // drop the "board" from leg 2
  ];

  const totalStations = leg1.totalStations + leg2.totalStations;
  const fare = calculateFare(totalStations, false);
  const discountedFare = hasGoSmartCard ? calculateFare(totalStations, true) : undefined;

  return {
    origin,
    destination,
    steps,
    totalStations,
    totalTime: leg1.totalTime + 4 + leg2.totalTime,
    interchangeCount: 1,
    fare,
    discountedFare,
    departureTime: leg1.departureTime,
    arrivalTime: leg2.arrivalTime,
    departureMinutes: leg1.departureMinutes,
    arrivalMinutes: leg2.arrivalMinutes,
    isDirect: false,
  };
};

export { getStationLine };
