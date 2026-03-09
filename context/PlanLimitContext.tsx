"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type LimitKey } from "@/hooks/useSubscription";

interface PlanLimitState {
  open: boolean;
  message: string;
  limitKey: LimitKey | null;
}

interface PlanLimitContextValue {
  state: PlanLimitState;
  triggerUpgrade: (message: string, limitKey?: LimitKey) => void;
  dismiss: () => void;
}

const PlanLimitContext = createContext<PlanLimitContextValue | null>(null);

export function PlanLimitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlanLimitState>({
    open: false,
    message: "",
    limitKey: null,
  });

  const triggerUpgrade = useCallback(
    (message: string, limitKey?: LimitKey) => {
      setState({ open: true, message, limitKey: limitKey ?? null });
    },
    []
  );

  const dismiss = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return (
    <PlanLimitContext.Provider value={{ state, triggerUpgrade, dismiss }}>
      {children}
    </PlanLimitContext.Provider>
  );
}

export function usePlanLimit() {
  const ctx = useContext(PlanLimitContext);
  if (!ctx) throw new Error("usePlanLimit must be inside PlanLimitProvider");
  return ctx;
}