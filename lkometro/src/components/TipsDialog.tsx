import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, IndianRupee, CreditCard, Baby, Wifi, ShieldCheck } from "lucide-react";
import { FARE_SLABS, GOSMART_CARD, TOURIST_CARDS, CHILD_FREE_HEIGHT_CM } from "@/data/fareData";
import { OPERATING_HOURS } from "@/data/timetable";
import { PEAK_HEADWAY_MINUTES, OFF_PEAK_HEADWAY_MINUTES } from "@/data/segmentTimings";

interface TipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TipsDialog = ({ open, onOpenChange }: TipsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Fares, hours & tips</DialogTitle>
          <DialogDescription>Everything you need to ride the Lucknow Metro Red Line.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fares">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="fares">Fares</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="fares" className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5" /> Single journey token fares
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              {FARE_SLABS.map((slab, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-sm border-b border-border last:border-0 odd:bg-secondary/30"
                >
                  <span>
                    {slab.minStations === slab.maxStations
                      ? `${slab.minStations} station`
                      : slab.maxStations === Infinity
                      ? `${slab.minStations}+ stations`
                      : `${slab.minStations}–${slab.maxStations} stations`}
                  </span>
                  <span className="font-medium">₹{slab.fare}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2 mt-2">
              <Baby className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Children under {CHILD_FREE_HEIGHT_CM}cm in height travel free.
            </div>
          </TabsContent>

          <TabsContent value="hours" className="space-y-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-3 py-2.5">
              <Clock className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">
                  {OPERATING_HOURS.firstTrain} – {OPERATING_HOURS.lastTrain}
                </p>
                <p className="text-xs text-muted-foreground">Daily operating hours</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Peak headway</p>
                <p className="font-display text-lg font-semibold">{PEAK_HEADWAY_MINUTES} min</p>
                <p className="text-[10px] text-muted-foreground">8–11 AM, 5–8 PM weekdays</p>
              </div>
              <div className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Off-peak headway</p>
                <p className="font-display text-lg font-semibold">{OFF_PEAK_HEADWAY_MINUTES} min</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
              <Wifi className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Free WiFi for smart card holders at every station, plus free drinking water and toilets.
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-3">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <CreditCard className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">GoSmart Card</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {GOSMART_CARD.discountPercent}% discount on every journey. Refundable deposit of ₹
                {GOSMART_CARD.depositRupees}.
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <CreditCard className="h-4 w-4 text-accent" />
                <p className="text-sm font-medium">Tourist Card</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Unlimited travel: ₹{TOURIST_CARDS.oneDayRupees} for 1 day, or ₹{TOURIST_CARDS.threeDayRupees} for
                3 days (plus ₹{TOURIST_CARDS.depositRupees} refundable deposit).
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          This app does not represent a government entity. Timings and fares are sourced from the
          official lucknow.upmetrorail.com.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipsDialog;
