// budget.ts
"use server";

import { revalidatePath } from "next/cache";
import { createBudget, updateBudget, deleteBudget } from "@/lib/api/budgets";
import { apiFetch } from "@/lib/api";

export async function createBudgetAction(
  workspaceId: string,
  input: BudgetUpsertInput,
) {
  const budget = await createBudget(workspaceId, input);
  revalidatePath("/dashboard/budgets");
  return budget;
}

export async function updateBudgetAction(
  workspaceId: string,
  id: string,
  input: Partial<BudgetUpsertInput>,
) {
  const b = await updateBudget(workspaceId, id, input);
  revalidatePath("/dashboard/budgets");
  return b;
}

export async function deleteBudgetAction(workspaceId: string, id: string) {
  await deleteBudget(workspaceId, id);
  revalidatePath("/dashboard/budgets");
}

export async function copyBudgetsToNextMonth(
  workspaceId: string,
  month: string,
) {
  return apiFetch(`/v1/workspaces/${workspaceId}/budgets/copy-to-next-month/`, {
    method: "POST",
    body: JSON.stringify({ month }),
  });
}
