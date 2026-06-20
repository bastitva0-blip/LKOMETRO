import { stations, LINE_STATIONS } from "@/data/metroData";
import { findNextTrain } from "@/data/timetable";
import { formatMinutesToTime } from "@/lib/utils";
import { getISTDate } from "@/lib/utils";

export interface MeetingPlan {
  meetingStationId: string;
  friendA: { originId: string; departureTime: string; arrivalTime: string; stationsAway: number };
  friendB: { originId: string; departureTime: string; arrivalTime: string; stationsAway: number };
  waitDifferenceMinutes: number;
}

/**
 * Find the best station for two friends (each starting from a different Red
 * Line station) to meet, minimizing the difference in their arrival times so
 * neither waits too long. Candidates are every station strictly between
 * (or at) the two origins along the line.
 */
export const findMeetingPoint = (originAId: string, originBId: string): MeetingPlan | null => {
  const order = LINE_STATIONS.red;
  const idxA = order.indexOf(originAId);
  const idxB = order.indexOf(originBId);
  if (idxA === -1 || idxB === -1 || idxA === idxB) return null;

  const now = getISTDate();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const lo = Math.min(idxA, idxB);
  const hi = Math.max(idxA, idxB);

  let best: MeetingPlan | null = null;

  for (let i = lo; i <= hi; i++) {
    const meetingId = order[i];
    if (meetingId === originAId || meetingId === originBId) {
      // Still valid — one friend is already there.
    }

    const trainA = originAId === meetingId
      ? null
      : findNextTrain(originAId, meetingId, nowMinutes);
    const trainB = originBId === meetingId
      ? null
      : findNextTrain(originBId, meetingId, nowMinutes);

    // Both must be reachable (or already there)
    if (originAId !== meetingId && !trainA) continue;
    if (originBId !== meetingId && !trainB) continue;

    const arrivalA = originAId === meetingId ? nowMinutes : trainA!.arrivalMinutes;
    const arrivalB = originBId === meetingId ? nowMinutes : trainB!.arrivalMinutes;
    const diff = Math.abs(arrivalA - arrivalB);

    if (!best || diff < best.waitDifferenceMinutes) {
      best = {
        meetingStationId: meetingId,
        friendA: {
          originId: originAId,
          departureTime: trainA ? formatMinutesToTime(trainA.departureMinutes) : "Already there",
          arrivalTime: formatMinutesToTime(arrivalA),
          stationsAway: Math.abs(order.indexOf(originAId) - i),
        },
        friendB: {
          originId: originBId,
          departureTime: trainB ? formatMinutesToTime(trainB.departureMinutes) : "Already there",
          arrivalTime: formatMinutesToTime(arrivalB),
          stationsAway: Math.abs(order.indexOf(originBId) - i),
        },
        waitDifferenceMinutes: Math.round(diff),
      };
    }
  }

  return best;
};
