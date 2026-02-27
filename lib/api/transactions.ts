import { apiFetch } from "../api";

export async function listTransactions(
  workspaceId: string,
  month: string,
): Promise<Transaction[]> {
  return apiFetch<Transaction[]>(
    `/v1/workspaces/${workspaceId}/transactions/?month=${encodeURIComponent(month)}`,
  );
}
