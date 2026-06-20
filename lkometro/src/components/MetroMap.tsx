import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Loader2 } from "lucide-react";
import { stations, LINE_STATIONS, LINE_COLORS, Station } from "@/data/metroData";
import { trainSchedules, getTrainPosition } from "@/data/timetable";
import { getISTDate, cn } from "@/lib/utils";
import { getStationCrowdLevel } from "@/data/crowdSimulation";
import { useGeolocation } from "@/hooks/use-geolocation";
import { findNearestStation } from "@/lib/nearestStation";
import {
  trainIconSvg,
  stationIconSvg,
  undergroundStationIconSvg,
  interchangeStationIconSvg,
} from "@/lib/leafletIcons";

const CENTER: [number, number] = [26.852, 80.94];
const DEFAULT_ZOOM = 12;

interface MetroMapProps {
  selectedStationId?: string | null;
  onStationClick?: (station: Station) => void;
  highlightRouteStationIds?: string[] | null;
  /** Called when a location fix resolves to a nearest station, so the page can offer it as a route origin. */
  onNearestStationFound?: (stationId: string, distanceKm: number, walkingMinutes: number) => void;
}

const getStationColor = (station: Station): string => {
  if (station.isInterchange) return "#F5C518";
  return LINE_COLORS[station.lines[0]];
};

const buildStationIcon = (station: Station, isSelected: boolean): L.DivIcon => {
  const color = getStationColor(station);
  const isWIP = !!station.isWIP;
  let html: string;
  let size: number;

  if (station.isInterchange) {
    size = isSelected ? 26 : 22;
    html = interchangeStationIconSvg(color, size);
  } else if (station.isUnderground) {
    size = isSelected ? 22 : 18;
    html = undergroundStationIconSvg(isSelected ? "#F5C518" : color, size);
  } else {
    size = isSelected ? 20 : 16;
    html = stationIconSvg(isSelected ? "#F5C518" : color, size);
  }

  return L.divIcon({
    className: "station-marker",
    html: `<div style="opacity: ${isWIP ? 0.5 : 1}; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));">${html}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const MetroMap = ({
  selectedStationId,
  onStationClick,
  highlightRouteStationIds,
  onNearestStationFound,
}: MetroMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const stationMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const trainMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const highlightLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const userPulseRef = useRef<L.CircleMarker | null>(null);
  const userToStationLineRef = useRef<L.Polyline | null>(null);
  const [activeTrainCount, setActiveTrainCount] = useState(0);
  const geo = useGeolocation();
  const hasCenteredOnUserRef = useRef(false);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // Draw Red Line route (solid, with dashed underground sections)
    const redOrder = LINE_STATIONS.red;
    const redCoords = redOrder.map((id) => stations[id].coordinates);
    const redLine = L.polyline(redCoords, {
      color: LINE_COLORS.red,
      weight: 5,
      opacity: 0.85,
      lineCap: "round",
    }).addTo(map);
    routeLayerRef.current = redLine;

    // Underground segment gets a dashed overlay for visual distinction
    const undergroundIds = ["charbagh", "hussainganj", "sachivalaya", "hazratganj", "kd_singh_babu_stadium"];
    const undergroundCoords = undergroundIds
      .filter((id) => redOrder.includes(id))
      .map((id) => stations[id].coordinates);
    L.polyline(undergroundCoords, {
      color: "#1f1f1f",
      weight: 2,
      opacity: 0.5,
      dashArray: "2 8",
    }).addTo(map);

    // Blue Line route — dashed, muted (under construction)
    const blueOrder = LINE_STATIONS.blue;
    const blueCoords = blueOrder.map((id) => stations[id].coordinates);
    L.polyline(blueCoords, {
      color: LINE_COLORS.blue,
      weight: 4,
      opacity: 0.45,
      dashArray: "8 8",
    }).addTo(map);

    // Station markers
    Object.values(stations).forEach((station) => {
      const isWIP = !!station.isWIP;
      const marker = L.marker(station.coordinates, {
        icon: buildStationIcon(station, false),
        zIndexOffset: station.isInterchange ? 500 : 0,
      }).addTo(map);

      const crowdInfo = !isWIP ? getStationCrowdLevel(station.id) : null;

      marker.bindPopup(
        `<div style="font-family: Inter, sans-serif; min-width: 160px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${station.name}</div>
          <div style="font-size: 12px; color: #6b6b6b;">
            ${isWIP ? "Under construction" : station.isUnderground ? "Underground station" : "Elevated station"}
            ${station.isInterchange ? " · Future interchange" : ""}
          </div>
          ${crowdInfo ? `<div style="font-size: 12px; margin-top: 4px;">${crowdInfo.emoji} ${crowdInfo.label} right now</div>` : ""}
        </div>`,
        { closeButton: true }
      );

      if (onStationClick && !isWIP) {
        marker.on("click", () => onStationClick(station));
      }

      stationMarkersRef.current.set(station.id, marker);
    });

    const stationMarkers = stationMarkersRef.current;
    const trainMarkers = trainMarkersRef.current;

    return () => {
      map.remove();
      mapRef.current = null;
      stationMarkers.clear();
      trainMarkers.clear();
      userMarkerRef.current = null;
      userPulseRef.current = null;
      userToStationLineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected station
  useEffect(() => {
    stationMarkersRef.current.forEach((marker, id) => {
      const station = stations[id];
      if (!station) return;
      const isSelected = id === selectedStationId;
      marker.setIcon(buildStationIcon(station, isSelected));
      marker.setZIndexOffset(isSelected ? 1000 : station.isInterchange ? 500 : 0);
    });
  }, [selectedStationId]);

  // Highlight a planned route's path on the map
  useEffect(() => {
    if (highlightLayerRef.current) {
      highlightLayerRef.current.remove();
      highlightLayerRef.current = null;
    }
    if (highlightRouteStationIds && highlightRouteStationIds.length > 1 && mapRef.current) {
      const coords = highlightRouteStationIds.map((id) => stations[id]?.coordinates).filter(Boolean) as [number, number][];
      const layer = L.polyline(coords, {
        color: "#F5C518",
        weight: 6,
        opacity: 0.9,
      }).addTo(mapRef.current);
      highlightLayerRef.current = layer;
      mapRef.current.fitBounds(layer.getBounds(), { padding: [60, 60] });
    }
  }, [highlightRouteStationIds]);

  // Show "you are here" marker + line to nearest station whenever a location fix arrives
  useEffect(() => {
    if (!mapRef.current || !geo.coordinates) return;
    const map = mapRef.current;

    // Pulsing outer ring
    if (!userPulseRef.current) {
      userPulseRef.current = L.circleMarker(geo.coordinates, {
        radius: 16,
        color: "#2563EB",
        weight: 1,
        opacity: 0.4,
        fillColor: "#2563EB",
        fillOpacity: 0.15,
        className: "animate-train-pulse",
      }).addTo(map);
    } else {
      userPulseRef.current.setLatLng(geo.coordinates);
    }

    // Solid dot
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.circleMarker(geo.coordinates, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#2563EB",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng(geo.coordinates);
    }

    // Line + nearest-station lookup, only on first fix (avoid redrawing on every GPS jitter)
    if (!hasCenteredOnUserRef.current) {
      hasCenteredOnUserRef.current = true;
      const nearest = findNearestStation(geo.coordinates);
      if (nearest) {
        if (userToStationLineRef.current) userToStationLineRef.current.remove();
        userToStationLineRef.current = L.polyline([geo.coordinates, nearest.station.coordinates], {
          color: "#2563EB",
          weight: 3,
          opacity: 0.6,
          dashArray: "4 8",
        }).addTo(map);

        const bounds = L.latLngBounds([geo.coordinates, nearest.station.coordinates]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });

        onNearestStationFound?.(nearest.station.id, nearest.distanceKm, nearest.walkingMinutes);
      } else {
        map.setView(geo.coordinates, 15);
      }
    }
  }, [geo.coordinates, onNearestStationFound]);


  const updateTrains = useCallback(() => {
    if (!mapRef.current) return;
    const now = getISTDate();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let count = 0;
    const seenIds = new Set<string>();

    for (const schedule of trainSchedules) {
      if (schedule.line !== "red") continue; // only Red Line is operational
      const position = getTrainPosition(schedule, currentMinutes);
      if (position.status !== "in_transit" && position.status !== "at_station") continue;
      if (!position.coordinates) continue;

      count++;
      seenIds.add(schedule.id);

      let marker = trainMarkersRef.current.get(schedule.id);
      const icon = L.divIcon({
        className: "train-marker animate-train-pulse",
        html: `<div style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.35));">${trainIconSvg(LINE_COLORS.red)}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      if (!marker) {
        marker = L.marker(position.coordinates, { icon, zIndexOffset: 1000 }).addTo(mapRef.current);
        marker.bindTooltip(`Train ${schedule.id} · ${schedule.direction === "forward" ? "→ Munshipulia" : "→ CCS Airport"}`, {
          direction: "top",
        });
        trainMarkersRef.current.set(schedule.id, marker);
      } else {
        marker.setLatLng(position.coordinates);
      }
    }

    // Remove markers for trains no longer running
    trainMarkersRef.current.forEach((marker, id) => {
      if (!seenIds.has(id)) {
        marker.remove();
        trainMarkersRef.current.delete(id);
      }
    });

    setActiveTrainCount(count);
  }, []);

  useEffect(() => {
    updateTrains();
    const interval = setInterval(updateTrains, 2000);
    return () => clearInterval(interval);
  }, [updateTrains]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 z-[400] bg-card/95 backdrop-blur rounded-lg border border-border px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          {activeTrainCount} train{activeTrainCount !== 1 ? "s" : ""} running
        </div>
      </div>

      <button
        onClick={() => {
          hasCenteredOnUserRef.current = false; // allow re-fit on a fresh request
          geo.locate();
        }}
        disabled={geo.status === "locating"}
        className={cn(
          "absolute bottom-24 right-3 z-[400] h-11 w-11 rounded-full bg-card border border-border shadow-md flex items-center justify-center transition-colors hover:bg-secondary disabled:opacity-70"
        )}
        aria-label="Find my location"
        title="Find my location"
      >
        {geo.status === "locating" ? (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        ) : (
          <LocateFixed className={cn("h-5 w-5", geo.status === "success" ? "text-primary" : "text-foreground")} />
        )}
      </button>

      {geo.status === "error" && geo.error && (
        <div className="absolute bottom-[9.5rem] right-3 z-[400] max-w-[220px] bg-card border border-destructive/40 text-xs rounded-lg px-3 py-2 shadow-md">
          {geo.error}
        </div>
      )}
    </div>
  );
};

export default MetroMap;
