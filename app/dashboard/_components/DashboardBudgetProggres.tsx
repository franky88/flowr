"use client";

import { formatMoney } from "@/lib/formatMoney";

interface DashboardBudgetProgressProps {
  kpis: DashboardKpis;
}

const DashboardBudgetProgress = ({ kpis }: DashboardBudgetProgressProps) => {
  const expense = Number(kpis.expense);
  const income = Number(kpis.income);
  const net = Number(kpis.net);

  const rawPct = income > 0 ? (expense / income) * 100 : 0;
  const clampedPct = Math.min(rawPct, 100);
  const isOverBudget = net < 0;
  const isNearLimit = !isOverBudget && rawPct >= 80;

  const barColor = isOverBudget
    ? "bg-destructive"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-primary";

  const pctDisplay = Math.round(rawPct);

  return (
    <div className="w-full border bg-card px-5 py-4 space-y-3 rounded-xl">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          Monthly Budget Usage
        </span>

        <div className="flex items-center gap-3 text-lg">
          <span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatMoney(expense)}
            </span>
            <span className="text-muted-foreground">
              {" "}
              / {formatMoney(income)}
            </span>
          </span>

          <span
            className={`px-2 py-0.5 rounded text-lg font-medium tabular-nums ${
              isOverBudget
                ? "bg-destructive/10 text-destructive"
                : isNearLimit
                  ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isOverBudget
              ? `${formatMoney(Math.abs(net))} over`
              : `${formatMoney(net)} left`}
          </span>
        </div>
      </div>

      {/* Progress bar + percentage */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${clampedPct}%` }}
          />
        </div>
        <span
          className={`text-sm font-semibold tabular-nums w-12 text-right ${
            isOverBudget
              ? "text-destructive"
              : isNearLimit
                ? "text-amber-500"
                : "text-muted-foreground"
          }`}
        >
          <strong className="text-2xl">{pctDisplay}%</strong>
        </span>
      </div>
    </div>
  );
};

export default DashboardBudgetProgress;
