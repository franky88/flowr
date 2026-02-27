// dashboard.ts
import { apiFetch } from "../api";

export async function getDashboard(params: {
  workspaceId: string;
  month: string;
  accountId?: string;
  mode?: "leaf" | "rollup";
}): Promise<DashboardResponse> {
  const qs = new URLSearchParams({ month: params.month });

  if (params.accountId) qs.append("accountId", params.accountId);
  if (params.mode) qs.append("mode", params.mode);

  return apiFetch<DashboardResponse>(
    `/v1/workspaces/${params.workspaceId}/reports/dashboard/?${qs.toString()}`,
    { method: "GET", cache: "no-store" },
  );
}
