import { useState } from "react";
import { TrainFront, Info, Wallet, BookOpen, Download } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import ThemeToggle from "@/components/ThemeToggle";
import AboutDialog from "@/components/AboutDialog";
import CardBalanceDialog from "@/components/CardBalanceDialog";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

interface SideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTips: () => void;
}

export const SideMenu = ({ open, onOpenChange, onOpenTips }: SideMenuProps) => {
  const { hasGoSmartCard, setHasGoSmartCard, balance } = useGoSmartCard();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const { canInstall, triggerInstall } = useInstallPrompt();

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                  <TrainFront className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <DrawerTitle>LkoMetro</DrawerTitle>
                  <p className="text-xs text-muted-foreground">Lucknow Metro companion</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-3">
              <div>
                <p className="text-sm font-medium">GoSmart Card</p>
                <p className="text-xs text-muted-foreground">10% discount on every journey</p>
              </div>
              <Switch checked={hasGoSmartCard} onCheckedChange={setHasGoSmartCard} />
            </div>

            <button
              onClick={() => setBalanceOpen(true)}
              className="w-full flex items-center justify-between rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Card balance</span>
              </span>
              <span className="text-sm font-semibold text-muted-foreground">₹{balance.toFixed(0)}</span>
            </button>

            <button
              onClick={onOpenTips}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Fares, hours &amp; tips</span>
            </button>

            <button
              onClick={() => setAboutOpen(true)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">About &amp; privacy</span>
            </button>

            {canInstall && (
              <>
                <Separator />
                <button
                  onClick={triggerInstall}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-3 bg-primary/10 hover:bg-primary/20 transition-colors text-left"
                >
                  <Download className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-primary">Install LkoMetro</p>
                    <p className="text-xs text-muted-foreground">Add to home screen</p>
                  </div>
                </button>
              </>
            )}

            <Separator />

            <div className="text-center space-y-1.5 pt-1">
              <p className="text-xs text-muted-foreground">Built by</p>
              <p className="text-sm font-medium">Astitva Bhardwaj</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <CardBalanceDialog open={balanceOpen} onOpenChange={setBalanceOpen} />
    </>
  );
};

export default SideMenu;
