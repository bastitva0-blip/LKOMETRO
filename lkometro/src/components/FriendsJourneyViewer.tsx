import { useState, useMemo } from "react";
import { Users, MapPin, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStationOptions, stations } from "@/data/metroData";
import { findMeetingPoint } from "@/lib/friendsJourney";

const stationOptions = getStationOptions();

export const FriendsJourneyViewer = () => {
  const [friendAOrigin, setFriendAOrigin] = useState("");
  const [friendBOrigin, setFriendBOrigin] = useState("");

  const plan = useMemo(() => {
    if (!friendAOrigin || !friendBOrigin || friendAOrigin === friendBOrigin) return null;
    return findMeetingPoint(friendAOrigin, friendBOrigin);
  }, [friendAOrigin, friendBOrigin]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        Find the best station for you both to meet on the Red Line.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Friend A starts from</label>
          <Select value={friendAOrigin} onValueChange={setFriendAOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Station" />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Friend B starts from</label>
          <Select value={friendBOrigin} onValueChange={setFriendBOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Station" />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {friendAOrigin && friendBOrigin && friendAOrigin === friendBOrigin && (
        <p className="text-sm text-muted-foreground">Pick two different starting stations.</p>
      )}

      {plan && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-fade-up">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Best meeting point</p>
              <p className="font-display text-lg font-semibold">{stations[plan.meetingStationId]?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FriendCard label="Friend A" data={plan.friendA} />
            <FriendCard label="Friend B" data={plan.friendB} />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
            <Clock className="h-3.5 w-3.5" />
            Arrival times differ by ~{plan.waitDifferenceMinutes} min — board the train shown for each friend.
          </div>
        </div>
      )}

      {friendAOrigin && friendBOrigin && friendAOrigin !== friendBOrigin && !plan && (
        <p className="text-sm text-muted-foreground">No meeting plan found right now — try again closer to service hours (06:00–22:00).</p>
      )}
    </div>
  );
};

const FriendCard = ({
  label,
  data,
}: {
  label: string;
  data: { originId: string; departureTime: string; arrivalTime: string; stationsAway: number };
}) => (
  <div className="rounded-lg bg-secondary/40 p-3">
    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
    <p className="text-sm font-medium">{stations[data.originId]?.name}</p>
    <p className="text-xs text-muted-foreground mt-1">
      {data.departureTime !== "Already there" ? `Board ${data.departureTime}` : "Already at meeting point"}
    </p>
    <p className="text-xs text-muted-foreground">Arrives {data.arrivalTime}</p>
  </div>
);

export default FriendsJourneyViewer;
