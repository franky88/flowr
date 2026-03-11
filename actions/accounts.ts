// accounts.ts
"use server";

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteAccount(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!id || !workspaceId) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/accounts/${id}/`, {
    method: "DELETE",
    rawErrorBody: true,
  });

  revalidatePath("/accounts");
}

export async function createAccount(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  if (!name) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/accounts/`, {
    method: "POST",
    body: JSON.stringify({ name }),
    rawErrorBody: true,
  });

  revalidatePath("/accounts");
}
