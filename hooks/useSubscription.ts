"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

export interface SubscriptionData {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  accounts: { used: number; limit: number | null };
  categories: { used: number; limit: number | null };
  months_history: { limit: number | null };
  current_period_end: string | null;
  features: {
    can_export: boolean;
    can_use_api: boolean;
  };
}

async function fetchSubscription(
  url: string,
  token: string
): Promise<SubscriptionData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}

export function useSubscription() {
  const { getToken, isSignedIn } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<SubscriptionData>(
    isSignedIn ? "/v1/subscription/" : null,
    async (url: string) => {
      const token = await getToken({ template: "cftracker" });
      if (!token) throw new Error("No token");
      return fetchSubscription(url, token);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000, // cache for 1 min
    }
  );

  console.log("Subscription data:", data);

  const plan = data?.plan ?? "free";
  const status = data?.status ?? "active";

  // Derived booleans — use these in UI
  const isPro = plan === "pro" || plan === "enterprise";
  const isEnterprise = plan === "enterprise";
  const isPastDue = status === "past_due";
  const isCancelled = status === 'cancelled'
  const currentPeriodEnd = data?.current_period_end ?? null

  const accountsAtLimit =
    data?.accounts?.limit !== null &&
    data?.accounts?.limit !== undefined &&
    (data?.accounts?.used ?? 0) >= data.accounts.limit;

  const categoriesAtLimit =
    data?.categories?.limit !== null &&
    data?.categories?.limit !== undefined &&
    (data?.categories?.used ?? 0) >= data.categories.limit;

  return {
    // Raw data
    data,
    isLoading,
    error,
    mutate,

    // Plan info
    plan,
    status,
    isPro,
    isEnterprise,
    isPastDue,
    isCancelled,           // ← new
    currentPeriodEnd,

    // Limits
    accountsUsed: data?.accounts?.used ?? 0,
    accountsLimit: data?.accounts?.limit ?? null,
    accountsAtLimit,

    categoriesUsed: data?.categories?.used ?? 0,
    categoriesLimit: data?.categories?.limit ?? null,
    categoriesAtLimit,

    monthsHistoryLimit: data?.months_history?.limit ?? null,

    // Feature flags
    canExport: data?.features?.can_export ?? false,
    canUseApi: data?.features?.can_use_api ?? false,
  };
}

// ─── Plan limit error ──────────────────────────────────────────────────────────
// Throw this when you catch a 402 from the API.
// The UpgradeModal listens for this via the PlanLimitContext.

export type LimitKey =
  | "max_accounts"
  | "max_categories"
  | "max_months_history"
  | "can_export"
  | "can_use_api";

export class PlanLimitError extends Error {
  limitKey: LimitKey;

  constructor(message: string, limitKey: LimitKey) {
    super(message);
    this.name = "PlanLimitError";
    this.limitKey = limitKey;
  }
}

// ─── apiFetch wrapper that parses 402s ────────────────────────────────────────
// Drop-in replacement for apiFetch in client components.
// On 402, throws PlanLimitError so UpgradeModal can catch it.

export async function apiFetchWithPlanCheck<T = unknown>(
  path: string,
  init?: RequestInit & { rawErrorBody?: boolean },
  token?: string | null
): Promise<T> {
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

  if (res.status === 402) {
    let limitKey: LimitKey = "max_accounts";
    let message = "Plan limit reached.";
    try {
      const json = JSON.parse(text);
      message = json.message ?? message;
      limitKey = json.limit_key ?? limitKey;
    } catch {}
    throw new PlanLimitError(message, limitKey);
  }

  if (!res.ok) {
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.detail ?? json.message ?? text;
    } catch {}
    throw new Error(message || `Request failed: ${res.status}`);
  }

  if (!text) return null as T;
  return JSON.parse(text) as T;
}