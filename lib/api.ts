import { auth } from "@clerk/nextjs/server";
import { ApiError, ApiErrorBody } from "@/lib/errors";

type ApiFetchInit = RequestInit & {
  rawErrorBody?: boolean;
};

export async function apiFetch<T = any>(
  path: string,
  init?: ApiFetchInit,
): Promise<T> {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new ApiError(401, { error: "unauthorized", message: "Not signed in." });
  }

  const token = await getToken({ template: "cftracker" });
  if (!token) {
    throw new ApiError(401, { error: "unauthorized", message: "No Clerk token (check JWT template name)." });
  }

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
    let body: ApiErrorBody = {
      error: "error",
      message: text || `Request failed: ${res.status}`,
    };
    try {
      const json = JSON.parse(text);
      body = {
        error: json.error ?? "error",
        message: json.message ?? json.detail ?? text,
        fields: json.fields,
        limit_key: json.limit_key,
      };
    } catch {}
    throw new ApiError(res.status, body);
  }

  if (!text) return null as T;

  const contentType = res.headers.get("content-type") ?? "";
  const isJson =
    contentType.includes("application/json") || contentType.includes("+json");

  return isJson ? (JSON.parse(text) as T) : (text as unknown as T);
}