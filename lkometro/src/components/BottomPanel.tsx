import { useState } from "react";
import { Route, Train, Users, Menu, ListTree } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import RoutePlanner from "@/components/RoutePlanner";
import FriendsJourneyViewer from "@/components/FriendsJourneyViewer";
import { LINE_STATIONS, stations, LINE_COLORS } from "@/data/metroData";
import { PlannedRoute } from "@/lib/routePlanner";
import { cn } from "@/lib/utils";

type PanelTab = "route" | "stations" | "friends" | null;

interface BottomPanelProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onOpenMenu: () => void;
  onOpenLiveTracking: () => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  onRoutePlanned: (route: PlannedRoute | null, stationIds: string[]) => void;
  onStationSelect: (stationId: string) => void;
}

export const BottomPanel = ({
  activeTab,
  onTabChange,
  onOpenMenu,
  onOpenLiveTracking,
  defaultOrigin,
  defaultDestination,
  onRoutePlanned,
  onStationSelect,
}: BottomPanelProps) => {
  const tabs: { key: Exclude<PanelTab, null>; label: string; icon: React.ReactNode }[] = [
    { key: "route", label: "Plan Route", icon: <Route className="h-5 w-5" /> },
    { key: "stations", label: "Stations", icon: <ListTree className="h-5 w-5" /> },
    { key: "friends", label: "Co-Commute", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Quick-access dock */}
      <div className="fixed bottom-0 inset-x-0 z-[1200] bg-card/95 backdrop-blur border-t border-border safe-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2 max-w-xl mx-auto">
          <DockButton icon={<Menu className="h-5 w-5" />} label="Menu" onClick={onOpenMenu} />
          {tabs.map((tab) => (
            <DockButton
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => onTabChange(activeTab === tab.key ? null : tab.key)}
            />
          ))}
          <DockButton icon={<Train className="h-5 w-5" />} label="Live" onClick={onOpenLiveTracking} />
        </div>
      </div>

      <Drawer open={activeTab !== null} onOpenChange={(open) => !open && onTabChange(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {activeTab === "route" && "Plan your journey"}
              {activeTab === "stations" && "All stations"}
              {activeTab === "friends" && "Co-commute"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 overflow-y-auto">
            {activeTab === "route" && (
              <RoutePlanner
                defaultOrigin={defaultOrigin}
                defaultDestination={defaultDestination}
                onRoutePlanned={onRoutePlanned}
              />
            )}
            {activeTab === "stations" && <StationListQuickScroll onSelect={onStationSelect} />}
            {activeTab === "friends" && <FriendsJourneyViewer />}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const DockButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 transition-colors",
      active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </button>
);

const StationListQuickScroll = ({ onSelect }: { onSelect: (stationId: string) => void }) => {
  return (
    <div className="space-y-1">
      {LINE_STATIONS.red.map((id, i) => {
        const station = stations[id];
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary/50 transition-colors text-left"
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: station.isInterchange ? "#F5C518" : LINE_COLORS.red }}
            />
            <span className="text-sm flex-1">{station.name}</span>
            {station.isUnderground && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">U/G</span>
            )}
            <span className="text-[10px] text-muted-foreground w-5 text-right">{i + 1}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomPanel;
