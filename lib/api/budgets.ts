// budgets.ts
import { apiFetch } from "@/lib/api";

export async function listBudgets(
  workspaceId: string,
  month: string,
): Promise<Budget[]> {
  const qs = new URLSearchParams({ month });
  return apiFetch<Budget[]>(
    `/v1/workspaces/${workspaceId}/budgets/?${qs.toString()}`,
    { method: "GET" },
  );
}

export async function createBudget(
  workspaceId: string,
  input: BudgetUpsertInput,
): Promise<Budget> {
  return apiFetch<Budget>(`/v1/workspaces/${workspaceId}/budgets/`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateBudget(
  workspaceId: string,
  id: string,
  input: Partial<BudgetUpsertInput>,
): Promise<Budget> {
  return apiFetch<Budget>(`/v1/workspaces/${workspaceId}/budgets/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteBudget(
  workspaceId: string,
  id: string,
): Promise<void> {
  await apiFetch(`/v1/workspaces/${workspaceId}/budgets/${id}/`, {
    method: "DELETE",
  });
}

export type BudgetMonitorMode = "leaf" | "rollup";

export async function getBudgetMonitor(
  workspaceId: string,
  month: string,
  accountId?: string,
  mode: BudgetMonitorMode = "rollup",
) {
  const qs = new URLSearchParams({ month, mode });
  if (accountId) qs.set("accountId", accountId);

  return apiFetch<BudgetMonitorReport>(
    `/v1/workspaces/${workspaceId}/reports/budget-monitor/?${qs.toString()}`,
  );
}

export async function getBudgetPeriod(
  workspaceId: string,
  dateFrom: string,
  dateTo: string,
  accountId?: string,
): Promise<BudgetPeriodReport> {
  const qs = new URLSearchParams({ dateFrom, dateTo });
  if (accountId) qs.set("accountId", accountId);
  return apiFetch<BudgetPeriodReport>(
    `/v1/workspaces/${workspaceId}/reports/budget-period/?${qs.toString()}`,
  );
}