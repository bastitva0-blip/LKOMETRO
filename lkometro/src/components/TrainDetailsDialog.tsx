import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Train, MapPin } from "lucide-react";
import { TrainSchedule, getTrainPosition } from "@/data/timetable";
import { stations, LINE_TERMINALS } from "@/data/metroData";
import { getISTDate, formatMinutesToTime, parseTimeToMinutes } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TrainDetailsDialogProps {
  schedule: TrainSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrainDetailsDialog = ({ schedule, open, onOpenChange }: TrainDetailsDialogProps) => {
  if (!schedule) return null;

  const now = getISTDate();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const position = getTrainPosition(schedule, currentMinutes);
  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const isForward = schedule.direction === "forward";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" /> Train {schedule.id}
          </DialogTitle>
          <DialogDescription>
            {isForward ? `Towards ${LINE_TERMINALS.red.end}` : `Towards ${LINE_TERMINALS.red.start}`} · Departed{" "}
            {schedule.startTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-0 max-h-96 overflow-y-auto">
          {schedule.stations.map((stationId, i) => {
            const station = stations[stationId];
            if (!station) return null;
            const arrivalMin = startMinutes + schedule.stationTimes[i];
            const isPast = position.status === "completed" || currentMinutes > arrivalMin + 0.5;
            const isCurrent = position.currentStationId === stationId && position.status === "at_station";

            return (
              <div key={stationId} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full shrink-0 mt-1.5",
                      isCurrent ? "bg-primary ring-4 ring-primary/20" : isPast ? "bg-primary/40" : "bg-border"
                    )}
                  />
                  {i < schedule.stations.length - 1 && <div className="w-0.5 flex-1 bg-border my-0.5" />}
                </div>
                <div className="pb-3 flex-1 flex items-center justify-between">
                  <span className={cn("text-sm", isCurrent && "font-semibold text-primary")}>{station.name}</span>
                  <span className="text-xs text-muted-foreground">{formatMinutesToTime(arrivalMin)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {position.status === "in_transit" && position.currentStationId && position.nextStationId && (
          <div className="flex items-center gap-2 text-xs bg-secondary/40 rounded-lg px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Currently between {stations[position.currentStationId]?.name} and {stations[position.nextStationId]?.name}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainDetailsDialog;
