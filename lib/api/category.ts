// category.ts
import { apiFetch } from "../api";
import { CategoryNode } from "../categories";

export async function listCategories(
  workspaceId: string,
): Promise<CategoryNode[]> {
  return apiFetch<CategoryNode[]>(`/v1/workspaces/${workspaceId}/categories/`);
}
