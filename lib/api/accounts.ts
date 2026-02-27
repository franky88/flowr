import { apiFetch } from "../api";

export async function listAccounts(workspaceId: string): Promise<Account[]> {
  return apiFetch<Account[]>(`/v1/workspaces/${workspaceId}/accounts/`);
}
