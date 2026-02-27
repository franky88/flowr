// transactions.ts
"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const month = String(formData.get("month") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!id || !workspaceId) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/transactions/${id}/`, {
    method: "DELETE",
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/transactions");
  if (month) revalidatePath(`/dashboard/transactions?month=${month}`);
}

export async function createTransactionAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const month = String(formData.get("month") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const account = String(formData.get("account") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!workspaceId || !date || !type || !amount || !account || !category)
    return;

  await apiFetch(`/v1/workspaces/${workspaceId}/transactions/`, {
    method: "POST",
    body: JSON.stringify({
      date,
      type,
      amount,
      account,
      category,
      note: note || null,
    }),
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/transactions");
  if (month) revalidatePath(`/dashboard/transactions?month=${month}`);
}

export async function updateTransactionAction(input: UpdateTransactionInput) {
  const { id, month, workspaceId, ...payload } = input;

  if (!workspaceId) throw new Error("workspaceId is required.");

  const apiPayload = {
    date: payload.date,
    type:
      payload.type === "income"
        ? "INCOME"
        : payload.type === "expense"
          ? "EXPENSE"
          : payload.type,
    amount: String(payload.amount),
    account: payload.accountId,
    category: payload.categoryId,
    note: payload.note ?? null,
  };

  await apiFetch(
    `/v1/workspaces/${workspaceId}/transactions/${encodeURIComponent(id)}/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiPayload),
      rawErrorBody: true,
    },
  );

  revalidatePath(`/dashboard/transactions?month=${encodeURIComponent(month)}`);
  revalidatePath("/dashboard/transactions");
}
