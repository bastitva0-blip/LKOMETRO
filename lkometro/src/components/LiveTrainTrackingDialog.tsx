import { useEffect, useState } from "react";
import { Train, ArrowRight, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trainSchedules, getTrainPosition, TrainSchedule } from "@/data/timetable";
import { stations, LINE_TERMINALS } from "@/data/metroData";
import { getISTDate } from "@/lib/utils";
import { getTrainCrowdLevel } from "@/data/crowdSimulation";

interface LiveTrainTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrain?: (schedule: TrainSchedule) => void;
}

export const LiveTrainTrackingDialog = ({ open, onOpenChange, onSelectTrain }: LiveTrainTrackingDialogProps) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(interval);
  }, [open]);

  const now = getISTDate();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const activeTrains = trainSchedules
    .filter((s) => s.line === "red")
    .map((schedule) => ({ schedule, position: getTrainPosition(schedule, currentMinutes) }))
    .filter((t) => t.position.status === "in_transit" || t.position.status === "at_station");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" /> Live Train Tracking
          </DialogTitle>
          <DialogDescription>
            {activeTrains.length} train{activeTrains.length !== 1 ? "s" : ""} currently running on the Red Line
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto -mx-1 px-1">
          {activeTrains.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No trains running right now. Service runs 06:00–22:00.
            </p>
          )}
          {activeTrains.map(({ schedule, position }) => {
            const currentStation = position.currentStationId ? stations[position.currentStationId] : null;
            const nextStation = position.nextStationId ? stations[position.nextStationId] : null;
            const isForward = schedule.direction === "forward";
            const crowd = getTrainCrowdLevel(position.progress ?? 0);

            return (
              <button
                key={schedule.id}
                onClick={() => onSelectTrain?.(schedule)}
                className="w-full text-left rounded-lg border border-border bg-secondary/30 p-3 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    {isForward ? <ArrowRight className="h-3.5 w-3.5 text-primary" /> : <ArrowLeft className="h-3.5 w-3.5 text-primary" />}
                    {isForward ? LINE_TERMINALS.red.end : LINE_TERMINALS.red.start}
                  </span>
                  <Badge variant={crowd.level === "heavy" ? "destructive" : crowd.level === "moderate" ? "warning" : "success"}>
                    {crowd.emoji} {crowd.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {position.status === "at_station" && currentStation
                    ? `At ${currentStation.name}`
                    : currentStation && nextStation
                    ? `Between ${currentStation.name} and ${nextStation.name}`
                    : "In transit"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Train {schedule.id}</p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveTrainTrackingDialog;
