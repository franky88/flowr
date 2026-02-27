import { apiFetch } from "@/lib/api";

export async function getWorkspaceId(): Promise<string> {
  const whoami = await apiFetch<{ workspaces: { id: string }[] }>(
    "/v1/whoami/",
  );
  const first = whoami.workspaces[0];
  if (!first) throw new Error("No workspace found.");
  return first.id;
}

export async function inviteMember(
  workspaceId: string,
  userId: string,
  role: "editor" | "viewer" = "editor",
) {
  return apiFetch(`/v1/workspaces/${workspaceId}/members/`, {
    method: "POST",
    body: JSON.stringify({ userId, role }),
  });
}

export async function removeMember(workspaceId: string, userId: string) {
  return apiFetch(`/v1/workspaces/${workspaceId}/members/`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
}

export async function getWorkspaceMembers(workspaceId: string) {
  return apiFetch<
    {
      userId: string;
      role: string;
      name: string;
      email: string;
      imageUrl: string;
    }[]
  >(`/v1/workspaces/${workspaceId}/members/`);
}
