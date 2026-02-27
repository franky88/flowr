import { auth } from "@clerk/nextjs/server";

type ApiFetchInit = RequestInit & {
  rawErrorBody?: boolean;
};

export async function apiFetch<T = any>(
  path: string,
  init?: ApiFetchInit,
): Promise<T> {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Not signed in");

  const token = await getToken({ template: "cftracker" });
  if (!token) throw new Error("No Clerk token (check JWT template name)");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.detail ?? json.message ?? text;
    } catch {}
    throw new Error(message || `Request failed: ${res.status}`);
  }

  if (!text) return null as T;
  const contentType = res.headers.get("content-type") ?? "";
  const isJson =
    contentType.includes("application/json") || contentType.includes("+json");

  return isJson ? (JSON.parse(text) as T) : (text as unknown as T);
}
