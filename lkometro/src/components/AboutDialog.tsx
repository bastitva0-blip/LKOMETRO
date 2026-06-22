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
              <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
