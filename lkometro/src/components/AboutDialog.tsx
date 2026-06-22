import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainFront, ShieldCheck, ExternalLink, Linkedin, Heart } from "lucide-react";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-primary" /> About LkoMetro
          </DialogTitle>
          <DialogDescription>Why this exists, and what it does with your data.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="why">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="why">Why</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="why" className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Lucknow Metro has been running since 2019, but if you just want to know
              when your train arrives or what the fare is, the options are not great.
              The official site is built for announcements, and generic map apps do not
              understand metro-specific things like fare slabs, train headways, or
              which stations are underground.
            </p>
            <p>
              <strong className="text-foreground">LkoMetro</strong> focuses on the
              three things a rider actually needs: when the next train is, what the
              fare will be, and the fastest route there. No ads, no clutter, and it
              works offline.
            </p>
            <p>
              It is an independent project, not affiliated with UPMRC. See the Privacy
              tab for what that means for your data.
            </p>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-2.5 rounded-lg bg-secondary/30 p-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p>
                This app does not represent a government entity. Timings and fares are sourced
                from the official{" "}
                <a
                  href="https://lucknow.upmetrorail.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  UPMRC website
                </a>
                .
              </p>
            </div>
            <p>
              <strong className="text-foreground">No accounts, no servers.</strong> LkoMetro
              has no backend or database. Your GoSmart Card preference, balance tracker,
              and theme choice are all stored in your browser and never sent anywhere.
            </p>
            <p>
              <strong className="text-foreground">Card balance tracker</strong> is a manual
              log you control. It does not read your physical card (there is no public way
              to do that) — it just keeps a running total based on amounts you enter
              yourself, on this device only.
            </p>
            <p>
              <strong className="text-foreground">Location</strong> is only used, with
              your permission, to find your nearest station. Your coordinates never leave
              your device.
            </p>
            <p>
              Map tiles load from OpenStreetMap's public servers, which may log standard
              request metadata like your IP per their own practices. We do not control that.
            </p>
            <p>No analytics, no ads, no third-party trackers.</p>
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <div className="text-center space-y-1.5 pt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                <TrainFront className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Astitva Bhardwaj</p>
              <p className="text-xs text-muted-foreground">Designer &amp; developer of LkoMetro</p>
              <a
                href="https://www.linkedin.com/in/astitva-bhardwajlu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <Heart className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p>
                Built independently from scratch, covering route planning, live train simulation,
                fare logic, offline support and the full map experience — because Lucknow
                Metro riders deserved something better than the official site for
                day-to-day commuting.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
