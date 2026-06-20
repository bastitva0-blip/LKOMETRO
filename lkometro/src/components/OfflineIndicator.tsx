import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[1100] bg-warning text-warning-foreground text-xs font-medium text-center py-1.5 flex items-center justify-center gap-1.5">
      <WifiOff className="h-3.5 w-3.5" />
      You're offline — LkoMetro still works with cached station data
    </div>
  );
};

export default OfflineIndicator;
