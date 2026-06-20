/**
 * Lucknow Metro Fare System
 *
 * Unlike Ahmedabad's per-station-pair fare matrix, UPMRC uses a simple
 * slab system based on the number of stations traveled (inclusive of
 * origin, i.e. "stations traveled through" = stops between + 1).
 *
 * Official slabs (single journey token):
 *   1 station          → ₹10
 *   2 stations         → ₹15
 *   3–6 stations       → ₹20
 *   7–9 stations       → ₹30
 *   10–13 stations     → ₹40
 *   14–17 stations     → ₹50
 *   18+ stations       → ₹60
 */

export interface FareSlab {
  minStations: number;
  maxStations: number;
  fare: number;
}

export const FARE_SLABS: FareSlab[] = [
  { minStations: 1, maxStations: 1, fare: 10 },
  { minStations: 2, maxStations: 2, fare: 15 },
  { minStations: 3, maxStations: 6, fare: 20 },
  { minStations: 7, maxStations: 9, fare: 30 },
  { minStations: 10, maxStations: 13, fare: 40 },
  { minStations: 14, maxStations: 17, fare: 50 },
  { minStations: 18, maxStations: Infinity, fare: 60 },
];

/** GoSmart Card: flat 10% discount on every journey, ₹100 refundable deposit. */
export const GOSMART_CARD = {
  discountPercent: 10,
  depositRupees: 100,
};

/** Tourist Card: unlimited travel for a fixed window. */
export const TOURIST_CARDS = {
  oneDayRupees: 100,
  threeDayRupees: 250,
  depositRupees: 100,
};

/** Children under 90cm in height travel free. */
export const CHILD_FREE_HEIGHT_CM = 90;

/**
 * Calculate base fare (token price, no discount) from the number of
 * stations traveled (i.e. stops between origin and destination, inclusive
 * count of 1 for adjacent stations).
 */
export const calculateBaseFare = (stationCount: number): number => {
  const n = Math.max(1, stationCount);
  const slab = FARE_SLABS.find((s) => n >= s.minStations && n <= s.maxStations);
  return slab ? slab.fare : FARE_SLABS[FARE_SLABS.length - 1].fare;
};

/** Apply the GoSmart Card 10% discount, rounded to the nearest rupee. */
export const applyGoSmartDiscount = (fare: number): number => {
  return Math.round(fare * (1 - GOSMART_CARD.discountPercent / 100));
};

/** Convenience: fare for a given number of stops between two stations on the same line. */
export const calculateFare = (stationCount: number, hasGoSmartCard = false): number => {
  const base = calculateBaseFare(stationCount);
  return hasGoSmartCard ? applyGoSmartDiscount(base) : base;
};
