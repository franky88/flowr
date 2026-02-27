"use client";

import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/formatMoney";

interface DashboardIndicatorProps {
  budgetRow: DashboardBudgetRow[];
}

const DashboardIndicator = ({ budgetRow }: DashboardIndicatorProps) => {
  if (!budgetRow.length) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No budgets configured for this month.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border bg-card rounded-xl">
      {budgetRow.map((budget) => {
        const spent = Number(budget.spent);
        const budgeted = Number(budget.budgetResolved);
        const remaining = Number(budget.remaining);
        const rawPct = budgeted > 0 ? (spent / budgeted) * 100 : 0;
        const clampedPct = Math.min(rawPct, 100);
        const isOverBudget = remaining < 0;
        const isNearLimit = !isOverBudget && rawPct >= 80;

        const barColor = isOverBudget
          ? "bg-destructive"
          : isNearLimit
            ? "bg-amber-500"
            : "bg-primary";

        return (
          <div
            key={budget.categoryId}
            className="grid grid-cols-[1fr_auto] gap-x-6 px-4 py-3 hover:bg-muted/40 transition-colors"
          >
            {/* Left: label + bar */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium truncate">
                  {budget.categoryName}
                </span>
                <div className="flex items-center gap-4 shrink-0 text-muted-foreground">
                  <span>
                    <span className="font-semibold text-foreground">
                      {formatMoney(spent)}
                    </span>{" "}
                    / {formatMoney(budgeted)}
                  </span>
                  <span
                    className={
                      isOverBudget
                        ? "text-destructive font-medium"
                        : isNearLimit
                          ? "text-amber-500 font-medium"
                          : "text-green-500"
                    }
                  >
                    {isOverBudget
                      ? `${formatMoney(Math.abs(remaining))} over`
                      : `${formatMoney(remaining)} left`}
                  </span>
                </div>
              </div>

              {/* Custom progress bar — avoids indicatorClassName prop issue */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${clampedPct}%` }}
                />
              </div>
            </div>

            {/* Right: percentage badge */}
            <div className="flex items-center justify-end w-16">
              <Badge
                variant={
                  isOverBudget
                    ? "destructive"
                    : isNearLimit
                      ? "outline"
                      : "secondary"
                }
                className={`tabular-nums text-xs font-mono ${
                  isNearLimit && !isOverBudget
                    ? "border-amber-400 text-amber-600 dark:text-amber-400"
                    : ""
                }`}
              >
                {Math.round(rawPct)}%
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardIndicator;
