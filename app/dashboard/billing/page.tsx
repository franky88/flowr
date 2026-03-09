"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { usePlanLimit } from "@/context/PlanLimitContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CancelButton } from "@/components/CancelButton";

// ─── Usage meter ──────────────────────────────────────────────────────────────

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const unlimited = limit === null;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit!) * 100));
  const atLimit = !unlimited && used >= limit!;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium tabular-nums",
            atLimit && "text-destructive"
          )}
        >
          {unlimited ? (
            <span className="text-muted-foreground">Unlimited</span>
          ) : (
            <>
              {used}{" "}
              <span className="text-muted-foreground font-normal">
                / {limit}
              </span>
            </>
          )}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              atLimit
                ? "bg-destructive"
                : pct >= 80
                ? "bg-amber-500"
                : "bg-primary"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard() {
  const {
    plan,
    status,
    isPro,
    isEnterprise,
    isPastDue,
    isCancelled,
    currentPeriodEnd,
    isLoading,
    accountsUsed,
    accountsLimit,
    categoriesUsed,
    categoriesLimit,
    monthsHistoryLimit,
    canExport,
  } = useSubscription();

  const { triggerUpgrade } = usePlanLimit();

  console.log("is cancelled?", isCancelled)
  console.log("is Pro?", isPro)
  console.log("Plan:", plan)

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    );
  }

  const planLabel = isEnterprise ? "Enterprise" : isPro ? "Pro" : "Free";

  const periodEndFormatted = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{planLabel} plan</span>
            {isPastDue && (
              <Badge
                variant="outline"
                className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
              >
                Past due
              </Badge>
            )}
            {isCancelled && isPro && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400">
                Cancels {periodEndFormatted}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {isPastDue
              ? "Your last payment failed. Update your payment method to keep Pro access."
              : isCancelled && isPro
              ? `You still have Pro access until ${periodEndFormatted}. After that, your account reverts to Free.`
              : isPro
              ? "Unlimited accounts, categories, and full history access."
              : "Up to 1 account, 10 categories, and 3 months of history."}
          </p>
        </div>

        {!isPro && (
          <Button size="sm" onClick={async () => {
            const res = await fetch("/api/subscription/checkout/", { method: "POST" })
            const { url } = await res.json()
            window.location.href = url
          }}>
            Upgrade to Pro
          </Button>
        )}

        {isPro && !isCancelled && (
          <Button size="sm" variant="outline" asChild>
            <a href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL ?? "#"} target="_blank" rel="noopener noreferrer">
              Manage billing
            </a>
          </Button>
        )}
      </div>

      {isPro && !isCancelled && (
        <div className="pt-2 border-t space-y-2">
          <p className="text-xs text-muted-foreground">
            Cancelling will keep Pro active until {periodEndFormatted ?? "end of billing period"}.
          </p>
          <CancelButton />
        </div>
      )}

      {/* Usage meters */}
      <div className="space-y-4 pt-2 border-t">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Usage
        </p>
        <UsageMeter label="Accounts" used={accountsUsed} limit={accountsLimit} />
        <UsageMeter
          label="Categories"
          used={categoriesUsed}
          limit={categoriesLimit}
        />
        <UsageMeter
          label="Months of history"
          used={0}
          limit={monthsHistoryLimit}
        />
      </div>

      {/* Feature flags */}
      <div className="space-y-2 pt-2 border-t">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Features
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <FeatureRow label="CSV Export" enabled={canExport} />
          <FeatureRow label="API Access" enabled={false} note="Enterprise" />
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  label,
  enabled,
  note,
}: {
  label: string;
  enabled: boolean;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "text-base",
          enabled ? "text-primary" : "text-muted-foreground"
        )}
      >
        {enabled ? "✓" : "✗"}
      </span>
      <span className={cn(!enabled && "text-muted-foreground")}>{label}</span>
      {note && (
        <span className="text-xs text-muted-foreground ml-auto">{note}</span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <main className="p-6 max-w-2xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Billing & Plan</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and view your current usage.
        </p>
      </header>

      <PlanCard />

      <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
        <p className="text-sm font-medium">Plan comparison</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2 font-medium text-muted-foreground w-1/2">
                  Feature
                </th>
                <th className="pb-2 font-medium text-center">Free</th>
                <th className="pb-2 font-semibold text-center text-primary">
                  Pro
                </th>
                <th className="pb-2 font-medium text-center text-muted-foreground">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Accounts", "1", "Unlimited", "Unlimited"],
                ["Categories", "10", "Unlimited", "Unlimited"],
                ["History", "3 months", "Unlimited", "Unlimited"],
                ["CSV Export", "✗", "✓", "✓"],
                ["API Access", "✗", "✗", "✓"],
              ].map(([feature, free, pro, enterprise]) => (
                <tr key={feature} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2 pr-4 text-muted-foreground">{feature}</td>
                  <td className="py-2 text-center">{free}</td>
                  <td className="py-2 text-center font-medium text-primary">
                    {pro}
                  </td>
                  <td className="py-2 text-center text-muted-foreground">
                    {enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}