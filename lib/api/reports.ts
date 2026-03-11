import { apiFetch } from "../api";
import { getWorkspaceId } from "./workspace";

// export type BudgetPeriodReport = {
//   total_income: string;
//   total_expense: string;
//   net: string;
//   categories: {
//     category_id: string;
//     category_name: string;
//     budget: string;
//     spent: string;
//     remaining: string;
//   }[];
// };

export const getBudgetPeriodReports = async (
  workspaceId: string,
  dateFrom: string,
  dateTo: string,
): Promise<BudgetPeriodReport> => {
  // const workspaceId = await getWorkspaceId();

  const params = new URLSearchParams({
    dateFrom: dateFrom,
    dateTo: dateTo,
  });

  return apiFetch(
    `/v1/workspaces/${workspaceId}/reports/budget-period/?${params.toString()}`,
  );
};

export async function getSpendingHistory(
  workspaceId: string,
  accountId?: string,
) {
  const qs = new URLSearchParams();
  if (accountId) qs.set("accountId", accountId);
  return apiFetch<SpendingRow[]>(
    `/v1/workspaces/${workspaceId}/reports/spending-history/?${qs}`,
  );
}

export interface SpendingRow {
  categoryId: string;
  categoryName: string;
  months: { month: string; spent: number }[];
  average: number;
}
