import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, RotateCcw, AlertCircle, ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";
import { useGoSmartCard } from "@/contexts/GoSmartCardContext";
import { cn } from "@/lib/utils";

interface CardBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [50, 100, 200, 500];

export const CardBalanceDialog = ({ open, onOpenChange }: CardBalanceDialogProps) => {
  const { balance, transactions, topUp, resetCard, hasGoSmartCard, setHasGoSmartCard } = useGoSmartCard();
  const [customAmount, setCustomAmount] = useState("");
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleTopUp = (amount: number) => {
    if (amount <= 0) return;
    topUp(amount);
    setCustomAmount("");
  };

  const handleReset = () => {
    resetCard(0);
    setConfirmingReset(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" /> GoSmart Card Balance
          </DialogTitle>
          <DialogDescription>
            A manual tracker — not a live read of your physical card.
          </DialogDescription>
        </DialogHeader>

        {!hasGoSmartCard && (
          <button
            onClick={() => setHasGoSmartCard(true)}
            className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5 text-left"
          >
            <span className="text-xs text-warning-foreground/90">
              GoSmart Card discount is off. Tap to enable it so trip deductions apply 10% off.
            </span>
          </button>
        )}

        <div className="rounded-xl bg-primary text-primary-foreground p-5 text-center">
          <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Current balance</p>
          <p className="font-display text-4xl font-semibold">₹{balance.toFixed(0)}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Top up</p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => handleTopUp(amt)}
                className="rounded-lg border border-border bg-secondary/40 py-2 text-sm font-medium hover:bg-secondary/70 transition-colors"
              >
                +₹{amt}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount"
              className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              size="sm"
              className="h-10"
              onClick={() => handleTopUp(Number(customAmount))}
              disabled={!customAmount || Number(customAmount) <= 0}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Recent activity</p>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No activity yet. Top up to get started, then deduct trips from the route planner.
            </p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {transactions.slice(0, 12).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg px-2.5 py-2 hover:bg-secondary/30">
                  <div className="flex items-center gap-2 min-w-0">
                    {tx.type === "topup" ? (
                      <ArrowUpCircle className="h-4 w-4 text-success shrink-0" />
                    ) : tx.type === "reset" ? (
                      <RefreshCw className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{tx.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={cn("text-xs font-medium shrink-0", tx.amount > 0 ? "text-success" : tx.amount < 0 ? "text-destructive" : "text-muted-foreground")}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount !== 0 ? `₹${tx.amount}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!confirmingReset ? (
          <button
            onClick={() => setConfirmingReset(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset balance
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs flex-1">Reset balance to ₹0 and clear history?</p>
            <Button size="sm" variant="destructive" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardBalanceDialog;
