"use server";

import { revalidatePath } from "next/cache";
import { inviteMember, removeMember } from "@/lib/api/workspace";

export async function inviteMemberAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "editor").trim();

  if (!workspaceId || !userId) return;

  await inviteMember(workspaceId, userId, role as "editor" | "viewer");
  revalidatePath("/dashboard/settings");
}

export async function removeMemberAction(formData: FormData) {
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const userId = String(formData.get("userId") ?? "").trim();

  if (!workspaceId || !userId) return;

  await removeMember(workspaceId, userId);
  revalidatePath("/dashboard/settings");
}
