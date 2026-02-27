"use server"

import { apiFetch } from "@/lib/api";
import { getWorkspaceId } from "@/lib/api/workspace";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const parent = String(formData.get("parent") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();

  if (!name) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/categories/`, {
    method: "POST",
    body: JSON.stringify({
      name,
      parent: parent ? parent : null,
    }),
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/settings");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  if (!id) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/categories/${id}/`, {
    method: "DELETE",
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/categories");
}

export async function updateCategory(formData: FormData) {
  const workspaceId = await getWorkspaceId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const parent = String(formData.get("parent") ?? "").trim();

  if (!id || !name) return;

  await apiFetch(`/v1/workspaces/${workspaceId}/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ name, parent: parent || null }),
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/settings");
}