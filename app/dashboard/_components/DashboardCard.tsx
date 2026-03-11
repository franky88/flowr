import { formatShortMonth } from "@/lib/month";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/*
  Colour mapping — dashboard-light.html → globals.css tokens
  ─────────────────────────────────────────────────────────────
  income  → --primary / --secondary        (#2d7a4f / #e8f5ee)
  expense → --destructive (red)            (#e05c5c)
  net     → --chart-5 (blue)               (#4a6fa5)
  balance → --chart-4 (amber)              (#d97c1a)
  default → --muted / --muted-foreground
*/

export function Card({
  title,
  value,
  variant = "default",
  delta,
  deltaPct,
  previousMonth,
}: {
  title: string;
  value: string;
  variant?: "income" | "expense" | "net" | "balance" | "default";
  delta?: string;
  deltaPct?: string | null;
  previousMonth?: string;
}) {
  // ── icon wrap bg (matches dashboard .kpi-icon-wrap) ──────────────
  const iconBg: Record<string, string> = {
    income: "bg-[color:var(--secondary)]", // #e8f5ee pale green
    expense: "bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)]",
    net: "bg-[color-mix(in_oklch,var(--chart-5)_12%,transparent)]",
    balance: "bg-[color-mix(in_oklch,var(--chart-4)_12%,transparent)]",
    default: "bg-muted",
  };

  // ── card background ───────────────────────────────────────────────
  const cardBg: Record<string, string> = {
    income:
      "bg-[color:var(--secondary)] dark:bg-[color-mix(in_oklch,var(--primary)_12%,transparent)]",
    expense: "bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)]",
    net: "bg-[color-mix(in_oklch,var(--chart-5)_8%,transparent)]",
    balance: "bg-[color-mix(in_oklch,var(--chart-4)_8%,transparent)]",
    default: "bg-muted/50",
  };

  // ── corner glow (::after in dashboard — approximated via ring) ────
  const ringColor: Record<string, string> = {
    income: "ring-[color:var(--primary)]/10",
    expense: "ring-[color:var(--destructive)]/10",
    net: "ring-[color:var(--chart-5)]/10",
    balance: "ring-[color:var(--chart-4)]/10",
    default: "ring-transparent",
  };

  // ── KPI value colour ──────────────────────────────────────────────
  const valueColor: Record<string, string> = {
    income:
      "text-[color:var(--primary)] dark:text-[color:var(--sidebar-primary)]", // #2d7a4f / #5ecf8a
    expense: "text-[color:var(--destructive)]",
    net: "text-[color:var(--chart-5)]",
    balance: "text-[color:var(--chart-4)]",
    default: "text-foreground",
  };

  // ── icon ──────────────────────────────────────────────────────────
  const icons: Record<string, string> = {
    income: "↑",
    expense: "↓",
    net: "≈",
    balance: "◎",
    default: "·",
  };

  // ── delta badge (matches dashboard .badge-up / .badge-down) ──────
  const deltaNumber = delta ? Number(delta) : 0;
  const isPositive = deltaNumber > 0;
  const isNegative = deltaNumber < 0;

  const deltaBadge = isPositive
    ? "bg-[color:var(--secondary)] text-[color:var(--primary)] dark:bg-[color-mix(in_oklch,var(--sidebar-primary)_15%,transparent)] dark:text-[color:var(--sidebar-primary)]"
    : isNegative
      ? "bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] text-[color:var(--destructive)]"
      : "bg-muted text-muted-foreground";

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-border
        p-5 ring-1 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg
        ${cardBg[variant]} ${ringColor[variant]}
      `}
    >
      {/* ── icon wrap ── */}
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-content:center rounded-[10px] ${iconBg[variant]}`}
      >
        <span
          className="w-full text-center text-base font-bold"
          style={{
            color: `var(--${variant === "income" || variant === "default" ? "primary" : variant === "expense" ? "destructive" : variant === "net" ? "chart-5" : "chart-4"})`,
          }}
        >
          {icons[variant]}
        </span>
      </div>

      {/* ── label ── */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
        {title}
      </p>

      {/* ── value ── */}
      <p
        className={`mt-1.5 font-mono text-3xl font-bold tracking-tight ${valueColor[variant]}`}
      >
        ₱{Number(value).toLocaleString()}
      </p>

      {/* ── delta badge ── */}
      {delta !== undefined && previousMonth && (
        <div
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold ${deltaBadge}`}
        >
          {isPositive && <ArrowUpRight className="h-3 w-3" />}
          {isNegative && <ArrowDownRight className="h-3 w-3" />}

          <span>
            {deltaNumber > 0 ? "+" : ""}₱
            {Math.abs(deltaNumber).toLocaleString()}
          </span>

          {deltaPct && (
            <span>
              ({deltaNumber > 0 ? "+" : ""}
              {deltaPct}%)
            </span>
          )}

          <span className="text-muted-foreground">
            vs {formatShortMonth(previousMonth)}
          </span>
        </div>
      )}

      {/* ── subtle corner glow (mirrors dashboard .kpi-card::after) ── */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-[0.08] ${iconBg[variant]}`}
      />
    </div>
  );
}
