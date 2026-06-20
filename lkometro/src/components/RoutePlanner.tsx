import { useState, useMemo } from "react";
import { ArrowRightLeft, Clock, IndianRupee, MapPin, Train, AlertCircle, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getOrganizedStations, LINE_COLORS } from "@/data/metroData";
import { planRoute, PlannedRoute } from "@/lib/routePlanner";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import { cn } from "@/lib/utils";

interface RoutePlannerProps {
  defaultOrigin?: string;
  defaultDestination?: string;
  onRoutePlanned?: (route: PlannedRoute | null, stationIds: string[]) => void;
}

const organized = getOrganizedStations();

export const RoutePlanner = ({ defaultOrigin, defaultDestination, onRoutePlanned }: RoutePlannerProps) => {
  const [origin, setOrigin] = useState<string>(defaultOrigin ?? "");
  const [destination, setDestination] = useState<string>(defaultDestination ?? "");
  const { hasGoSmartCard, setHasGoSmartCard } = useGoSmartCard();

  const route = useMemo(() => {
    if (!origin || !destination || origin === destination) return null;
    const r = planRoute(origin, destination, hasGoSmartCard);
    if (onRoutePlanned) {
      onRoutePlanned(r, r ? r.steps.flatMap((s) => (s.stations ?? [])).map((s) => s.id) : []);
    }
    return r;
  }, [origin, destination, hasGoSmartCard]); // eslint-disable-line react-hooks/exhaustive-deps

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From</label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {organized.map((group) => (
                <SelectGroup key={group.line}>
                  <SelectLabel>{group.lineName}</SelectLabel>
                  {group.stations
                    .filter((s) => !s.isWIP)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="icon" onClick={swap} className="mb-0.5" aria-label="Swap origin and destination">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To</label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {organized.map((group) => (
                <SelectGroup key={group.line}>
                  <SelectLabel>{group.lineName}</SelectLabel>
                  {group.stations
                    .filter((s) => !s.isWIP)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2.5 cursor-pointer">
        <span className="text-sm font-medium">I have a GoSmart Card</span>
        <input
          type="checkbox"
          checked={hasGoSmartCard}
          onChange={(e) => setHasGoSmartCard(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
      </label>

      {origin && destination && origin === destination && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> Pick two different stations to plan a journey.
        </p>
      )}

      {route && <RouteResult route={route} hasGoSmartCard={hasGoSmartCard} />}

      {origin && destination && origin !== destination && !route && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> No route available between these stations yet.
        </p>
      )}
    </div>
  );
};

const RouteResult = ({ route, hasGoSmartCard }: { route: PlannedRoute; hasGoSmartCard: boolean }) => {
  const { balance, deductTrip } = useGoSmartCard();
  const fareToShow = hasGoSmartCard && route.discountedFare !== undefined ? route.discountedFare : route.fare;
  const [deductState, setDeductState] = useState<"idle" | "done" | "insufficient">("idle");

  const handleDeduct = () => {
    const label = `${route.origin.name} → ${route.destination.name}`;
    const ok = deductTrip(fareToShow, label);
    setDeductState(ok ? "done" : "insufficient");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-fade-up">
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Clock className="h-4 w-4" />} label="Duration" value={`${route.totalTime} min`} />
        <Stat icon={<MapPin className="h-4 w-4" />} label="Stations" value={`${route.totalStations}`} />
        <Stat
          icon={<IndianRupee className="h-4 w-4" />}
          label="Fare"
          value={`₹${fareToShow}`}
          strike={hasGoSmartCard ? `₹${route.fare}` : undefined}
        />
      </div>

      {route.departureTime && (
        <div className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg px-3 py-2">
          <Train className="h-4 w-4 text-primary" />
          <span>
            Next train departs <strong>{route.departureTime}</strong>
            {route.arrivalTime && (
              <>
                {" "}
                · arrives <strong>{route.arrivalTime}</strong>
              </>
            )}
          </span>
        </div>
      )}

      {route.interchangeCount > 0 && (
        <Badge variant="warning" className="gap-1">
          {route.interchangeCount} interchange{route.interchangeCount > 1 ? "s" : ""} required
        </Badge>
      )}

      <div className="space-y-0">
        {route.steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 border-background shrink-0 mt-1",
                  step.type === "board" && "ring-2 ring-offset-2 ring-offset-card"
                )}
                style={{ background: step.line ? LINE_COLORS[step.line] : "#94a3b8" }}
              />
              {i < route.steps.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-sm font-medium">
                {step.type === "board" && `Board at ${step.station.name}`}
                {step.type === "travel" &&
                  `Travel ${step.stationCount} station${step.stationCount !== 1 ? "s" : ""} to ${step.station.name}`}
                {step.type === "interchange" && `Change at ${step.station.name}`}
                {step.type === "alight" && `Alight at ${step.station.name}`}
              </p>
              {step.direction && <p className="text-xs text-muted-foreground">{step.direction}</p>}
              {step.trainTime && step.type === "board" && (
                <p className="text-xs text-muted-foreground">Departs {step.trainTime}</p>
              )}
              {step.waitTime !== undefined && (
                <p className="text-xs text-muted-foreground">Wait ~{step.waitTime} min</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Manual GoSmart Card balance deduction — not automatic, since the app has no way to
          know if you actually boarded. Confirms the trip and logs it to your balance tracker. */}
      <div className="border-t border-border pt-3">
        {deductState === "done" ? (
          <div className="flex items-center gap-2 text-sm text-success bg-success/10 rounded-lg px-3 py-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            ₹{fareToShow} deducted. New balance: ₹{balance}
          </div>
        ) : deductState === "insufficient" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Balance too low (₹{balance}). Top up in the card balance menu first.
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full gap-2" onClick={handleDeduct}>
            <Wallet className="h-4 w-4" /> Deduct ₹{fareToShow} from card balance
          </Button>
        )}
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Manual tracker on this device — not a live read of your physical card.
        </p>
      </div>
    </div>
  );
};

const Stat = ({
  icon,
  label,
  value,
  strike,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  strike?: string;
}) => (
  <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">{icon}</div>
    <div className="font-display text-base font-semibold leading-none">
      {value}
      {strike && <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">{strike}</span>}
    </div>
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{label}</div>
  </div>
);

export default RoutePlanner;
