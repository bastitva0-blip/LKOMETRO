import { useState, useEffect } from "react";
import { TrainFront, Route, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lkometro:hasSeenWelcome";

export const WelcomeOverlay = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-up">
      <div className="max-w-sm w-full rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
          <TrainFront className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-1">Welcome to LkoMetro</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Your companion for the Lucknow Metro Red Line — plan journeys, track trains live, and
          check fares, all in one place.
        </p>

        <div className="space-y-3 mb-6">
          <Feature icon={<Route className="h-4 w-4" />} text="Plan routes with live fares and timings" />
          <Feature icon={<TrainFront className="h-4 w-4" />} text="Track trains live on the map" />
          <Feature icon={<Users className="h-4 w-4" />} text="Find the best station to meet a friend" />
          <Feature icon={<Wifi className="h-4 w-4" />} text="Works offline once loaded" />
        </div>

        <Button onClick={dismiss} className="w-full" size="lg">
          Get started
        </Button>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <p className="text-sm">{text}</p>
  </div>
);

export default WelcomeOverlay;
