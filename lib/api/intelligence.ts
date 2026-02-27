// lib/api/intelligence.ts
import { apiFetch } from "../api";

export interface BudgetRisk {
  categoryId: string;
  categoryName: string;
  monthlyBudget: string;
  spent: string;
  expectedSpend: string;
  projectedSpend: string;
  projectedOverrun: string;
  riskLevel: "ok" | "warning" | "critical";
  isCurrentlyExceeded: boolean;
}

export interface IntelligenceReport {
  month: string;
  asOf: string;
  daysElapsed: number;
  daysRemaining: number;
  daysInMonth: number;
  currentBalance: string;
  forecastBalance: string;
  dailyBurnRate: string;
  daysUntilZero: number | null;
  budgetRisks: BudgetRisk[];
  incomeVolatility: {
    months: { month: string; income: string }[];
    stdDev: string;
    cvPercent: string;
    label: "stable" | "volatile" | "highly_volatile" | "insufficient_data";
  };
}

export async function getIntelligence(params: {
  workspaceId: string;
  month: string;
  accountId?: string;
}): Promise<IntelligenceReport> {
  const qs = new URLSearchParams({ month: params.month });
  if (params.accountId) qs.set("accountId", params.accountId);
  return apiFetch<IntelligenceReport>(
    `/v1/workspaces/${params.workspaceId}/intelligence/?${qs}`,
    { cache: "no-store" },
  );
}