import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a new Date object artificially shifted so that local methods
 * (getHours, getMinutes, getDay, etc.) return the time in Indian Standard Time (IST).
 * This prevents bugs when a user accesses the app from a different timezone.
 */
export const getISTDate = (): Date => {
  const now = new Date();
  const localOffsetMinutes = -now.getTimezoneOffset();
  const istOffsetMinutes = 330; // +5:30
  const shift = istOffsetMinutes - localOffsetMinutes;
  return new Date(now.getTime() + shift * 60000);
};

/** Haversine distance between two [lat, lng] points, in kilometers. */
export const haversineDistanceKm = (
  a: [number, number],
  b: [number, number]
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
};

export const formatMinutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const parseTimeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
