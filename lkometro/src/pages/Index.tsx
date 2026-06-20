import { useState, useCallback } from "react";
import { Navigation, X } from "lucide-react";
import MetroMap from "@/components/MetroMap";
import BottomPanel from "@/components/BottomPanel";
import SideMenu from "@/components/SideMenu";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import OfflineIndicator from "@/components/OfflineIndicator";
import TipsDialog from "@/components/TipsDialog";
import LiveTrainTrackingDialog from "@/components/LiveTrainTrackingDialog";
import TrainDetailsDialog from "@/components/TrainDetailsDialog";
import SearchBar from "@/components/SearchBar";
import { Station, stations } from "@/data/metroData";
import { TrainSchedule } from "@/data/timetable";
import { PlannedRoute } from "@/lib/routePlanner";

type PanelTab = "route" | "stations" | "friends" | null;

interface NearestStationInfo {
  stationId: string;
  distanceKm: number;
  walkingMinutes: number;
}

const Index = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [liveTrackingOpen, setLiveTrackingOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<string | undefined>();
  const [routeDestination, setRouteDestination] = useState<string | undefined>();
  const [highlightedRoute, setHighlightedRoute] = useState<string[] | null>(null);
  const [nearestStation, setNearestStation] = useState<NearestStationInfo | null>(null);
  const [showNearestPrompt, setShowNearestPrompt] = useState(false);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station);
    if (!routeOrigin) {
      setRouteOrigin(station.id);
    } else {
      setRouteDestination(station.id);
    }
    setActiveTab("route");
  }, [routeOrigin]);

  const handleSearchSelect = useCallback((stationId: string) => {
    setRouteDestination(stationId);
    setActiveTab("route");
  }, []);

  const handleRoutePlanned = useCallback((route: PlannedRoute | null, stationIds: string[]) => {
    if (route) {
      const fullPath = [route.origin.id, ...stationIds, route.destination.id];
      setHighlightedRoute(fullPath);
    } else {
      setHighlightedRoute(null);
    }
  }, []);

  // Called by MetroMap once a geolocation fix resolves to a nearest station.
  const handleNearestStationFound = useCallback(
    (stationId: string, distanceKm: number, walkingMinutes: number) => {
      setNearestStation({ stationId, distanceKm, walkingMinutes });
      setShowNearestPrompt(true);
    },
    []
  );

  const useNearestAsOrigin = () => {
    if (!nearestStation) return;
    setRouteOrigin(nearestStation.stationId);
    setShowNearestPrompt(false);
    setActiveTab("route");
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      <OfflineIndicator />
      <WelcomeOverlay />

      <MetroMap
        selectedStationId={selectedStation?.id}
        onStationClick={handleStationClick}
        highlightRouteStationIds={highlightedRoute}
        onNearestStationFound={handleNearestStationFound}
      />

      {/* Top search bar — sits above Leaflet's own panes/controls (z-[1200]) */}
      <div className="absolute top-3 right-3 left-3 sm:left-32 z-[1200] max-w-md ml-auto">
        <SearchBar onSelectStation={handleSearchSelect} />
      </div>

      {/* "Nearest station found" prompt — appears after a successful location fix */}
      {showNearestPrompt && nearestStation && (
        <div className="absolute top-16 right-3 left-3 sm:left-auto sm:w-80 z-[1200] bg-card border border-border rounded-xl shadow-lg p-3.5 animate-fade-up">
          <button
            onClick={() => setShowNearestPrompt(false)}
            className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-2.5 pr-5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Navigation className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                Nearest station: {stations[nearestStation.stationId]?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ~{nearestStation.distanceKm.toFixed(1)} km away · {nearestStation.walkingMinutes} min walk
              </p>
              <button
                onClick={useNearestAsOrigin}
                className="mt-2 text-xs font-medium text-primary hover:underline"
              >
                Start my journey from here →
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomPanel
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenLiveTracking={() => setLiveTrackingOpen(true)}
        defaultOrigin={routeOrigin}
        defaultDestination={routeDestination}
        onRoutePlanned={handleRoutePlanned}
        onStationSelect={(id) => {
          setRouteDestination(id);
          setActiveTab("route");
        }}
      />

      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} onOpenTips={() => setTipsOpen(true)} />
      <TipsDialog open={tipsOpen} onOpenChange={setTipsOpen} />
      <LiveTrainTrackingDialog
        open={liveTrackingOpen}
        onOpenChange={setLiveTrackingOpen}
        onSelectTrain={(schedule) => {
          setSelectedTrain(schedule);
          setLiveTrackingOpen(false);
        }}
      />
      <TrainDetailsDialog
        schedule={selectedTrain}
        open={!!selectedTrain}
        onOpenChange={(open) => !open && setSelectedTrain(null)}
      />
    </div>
  );
};

export default Index;
