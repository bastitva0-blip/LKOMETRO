import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { applyGoSmartDiscount, GOSMART_CARD } from "@/data/fareData";

export interface CardTransaction {
  id: string;
  type: "topup" | "trip" | "reset";
  amount: number; // positive for top-up, negative for trip deduction
  label: string; // e.g. "Top up" or "Charbagh → Hazratganj"
  timestamp: number;
  balanceAfter: number;
}

interface GoSmartCardContextType {
  hasGoSmartCard: boolean;
  setHasGoSmartCard: (value: boolean) => void;
  getDiscountedFare: (fare: number) => number;

  /** Manual balance tracker — NOT a real read of your physical card. */
  balance: number;
  transactions: CardTransaction[];
  topUp: (amount: number) => void;
  deductTrip: (amount: number, label: string) => boolean; // false if insufficient balance
  resetCard: (newBalance?: number) => void;
}

const GoSmartCardContext = createContext<GoSmartCardContextType | undefined>(undefined);

const HAS_CARD_KEY = "lkometro:hasGoSmartCard";
const BALANCE_KEY = "lkometro:cardBalance";
const TRANSACTIONS_KEY = "lkometro:cardTransactions";
const MAX_TRANSACTIONS = 50;

const readBool = (key: string): boolean => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeBool = (key: string, value: boolean): void => {
  try {
    localStorage.setItem(key, value.toString());
  } catch {
    // Ignore storage failures in restricted/private browsing contexts.
  }
};

const readNumber = (key: string, fallback: number): number => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
};

const writeNumber = (key: string, value: number): void => {
  try {
    localStorage.setItem(key, value.toString());
  } catch {
    // ignore
  }
};

const readTransactions = (): CardTransaction[] => {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeTransactions = (transactions: CardTransaction[]): void => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions.slice(0, MAX_TRANSACTIONS)));
  } catch {
    // ignore
  }
};

export const GoSmartCardProvider = ({ children }: { children: ReactNode }) => {
  const [hasGoSmartCard, setHasGoSmartCardState] = useState(() => readBool(HAS_CARD_KEY));
  const [balance, setBalance] = useState(() => readNumber(BALANCE_KEY, 0));
  const [transactions, setTransactions] = useState<CardTransaction[]>(() => readTransactions());

  useEffect(() => {
    writeBool(HAS_CARD_KEY, hasGoSmartCard);
  }, [hasGoSmartCard]);

  useEffect(() => {
    writeNumber(BALANCE_KEY, balance);
  }, [balance]);

  useEffect(() => {
    writeTransactions(transactions);
  }, [transactions]);

  const setHasGoSmartCard = (value: boolean) => {
    setHasGoSmartCardState(value);
  };

  const getDiscountedFare = (fare: number): number => {
    return hasGoSmartCard ? applyGoSmartDiscount(fare) : fare;
  };

  const addTransaction = (tx: Omit<CardTransaction, "id" | "timestamp" | "balanceAfter">, newBalance: number) => {
    const entry: CardTransaction = {
      ...tx,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      balanceAfter: newBalance,
    };
    setTransactions((prev) => [entry, ...prev].slice(0, MAX_TRANSACTIONS));
  };

  const topUp = (amount: number) => {
    if (amount <= 0) return;
    const next = Math.round((balance + amount) * 100) / 100;
    setBalance(next);
    addTransaction({ type: "topup", amount, label: "Top up" }, next);
  };

  /** Returns false (and does not deduct) if the balance is insufficient. */
  const deductTrip = (amount: number, label: string): boolean => {
    if (amount <= 0) return true;
    if (balance < amount) return false;
    const next = Math.round((balance - amount) * 100) / 100;
    setBalance(next);
    addTransaction({ type: "trip", amount: -amount, label }, next);
    return true;
  };

  const resetCard = (newBalance: number = 0) => {
    setBalance(newBalance);
    setTransactions([]);
    writeTransactions([]);
    addTransaction({ type: "reset", amount: 0, label: "Balance reset" }, newBalance);
  };

  return (
    <GoSmartCardContext.Provider
      value={{
        hasGoSmartCard,
        setHasGoSmartCard,
        getDiscountedFare,
        balance,
        transactions,
        topUp,
        deductTrip,
        resetCard,
      }}
    >
      {children}
    </GoSmartCardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGoSmartCard = () => {
  const context = useContext(GoSmartCardContext);
  if (!context) {
    throw new Error("useGoSmartCard must be used within a GoSmartCardProvider");
  }
  return context;
};

export { GOSMART_CARD };
