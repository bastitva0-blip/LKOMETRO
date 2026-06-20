import { useState, useCallback, useRef } from "react";

export interface GeolocationState {
  coordinates: [number, number] | null;
  accuracy: number | null;
  status: "idle" | "locating" | "success" | "error";
  error: string | null;
}

interface UseGeolocationReturn extends GeolocationState {
  /** Request a one-time location fix. */
  locate: () => void;
  /** Start continuously watching position (e.g. while navigating). */
  startWatching: () => void;
  stopWatching: () => void;
  isWatching: boolean;
}

/**
 * Wraps the browser Geolocation API with sensible defaults for a transit app:
 * high accuracy, a reasonable timeout, and both one-shot and continuous-watch
 * modes (the latter for "guide me" live navigation to a station).
 */
export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    accuracy: null,
    status: "idle",
    error: null,
  });
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setState({
      coordinates: [pos.coords.latitude, pos.coords.longitude],
      accuracy: pos.coords.accuracy,
      status: "success",
      error: null,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const message =
      err.code === err.PERMISSION_DENIED
        ? "Location access denied. Enable it in your browser settings to find your nearest station."
        : err.code === err.POSITION_UNAVAILABLE
        ? "Couldn't determine your location right now."
        : "Location request timed out.";
    setState((s) => ({ ...s, status: "error", error: message }));
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, status: "error", error: "Geolocation isn't supported on this device." }));
      return;
    }
    setState((s) => ({ ...s, status: "locating", error: null }));
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  }, [handleSuccess, handleError]);

  const startWatching = useCallback(() => {
    if (!("geolocation" in navigator) || watchIdRef.current !== null) return;
    setState((s) => ({ ...s, status: "locating", error: null }));
    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    });
    setIsWatching(true);
  }, [handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  }, []);

  return { ...state, locate, startWatching, stopWatching, isWatching };
}
