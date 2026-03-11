"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export type BudgetChartRow = {
  categoryId: string;
  categoryName: string;
  budgetResolved: string;
  spent: string;
  remaining: string;
  isExceeded: boolean;
};

export function fromBudgetMonitor(rows: BudgetMonitorRow[]): BudgetChartRow[] {
  return rows
    .filter(
      (
        r,
      ): r is BudgetMonitorRow & {
        budgetResolved: string;
        remaining: string;
      } => r.budgetResolved !== null && r.remaining !== null,
    )
    .map((r) => ({
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      budgetResolved: r.budgetResolved,
      spent: r.spent,
      remaining: r.remaining,
      isExceeded: r.isExceeded,
    }));
}

export function fromDashboard(rows: DashboardBudgetRow[]): BudgetChartRow[] {
  return rows.map((r) => ({
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    budgetResolved: r.budgetResolved,
    spent: r.spent,
    remaining: r.remaining,
    isExceeded: r.isExceeded,
  }));
}

interface BudgetPieChartProps {
  rows: BudgetChartRow[];
  /** From API totals.spent */
  totalSpent: string;
  /** From API totals.budgetResolved */
  totalBudget: string;
  className?: string;
}

const CHART_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#6366f1", // indigo
  "#14b8a6", // teal
];
const EXCEEDED_COLOR = "#ef4444";

const chartConfig = {
  spent: { label: "Spent" },
} satisfies ChartConfig;

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
}

function pct(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min((spent / budget) * 100, 100);
}

function ActiveSlice(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
}

export function BudgetPieChart({
  rows,
  totalSpent,
  totalBudget,
  className,
}: BudgetPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Only slices with actual spend; color index only increments for non-exceeded
  const chartData = useMemo(() => {
    let colorIndex = 0;
    return rows
      .filter((r) => parseFloat(r.spent) > 0)
      .map((r) => {
        const color = r.isExceeded
          ? EXCEEDED_COLOR
          : CHART_COLORS[colorIndex++ % CHART_COLORS.length];
        return {
          name: r.categoryName,
          categoryId: r.categoryId,
          value: parseFloat(r.spent),
          budget: parseFloat(r.budgetResolved),
          remaining: parseFloat(r.remaining),
          exceeded: r.isExceeded,
          color,
        };
      });
  }, [rows]);

  // Stable color lookup by categoryId — used by legend to avoid re-computing index
  const colorByCategoryId = useMemo(
    () => Object.fromEntries(chartData.map((d) => [d.categoryId, d.color])),
    [chartData],
  );

  const totalSpentNum = parseFloat(totalSpent);
  const totalBudgetNum = parseFloat(totalBudget);
  const totalRemaining = totalBudgetNum - totalSpentNum;
  const overallExceeded = totalRemaining < 0;
  const activeSlice = activeIndex !== null ? chartData[activeIndex] : null;

  if (chartData.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-64 text-muted-foreground text-sm",
          className,
        )}
      >
        No spending data for this period.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start",
        className,
      )}
    >
      {/* ── Donut chart ───────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-80 w-80">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={110}
              paddingAngle={2}
              activeIndex={activeIndex ?? undefined}
              activeShape={<ActiveSlice />}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.categoryId}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                  style={{ cursor: "pointer", outline: "none" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Center KPI — overlaid on the donut hole */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          {activeSlice ? (
            <>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                {activeSlice.name.length > 12
                  ? activeSlice.name.slice(0, 12) + "…"
                  : activeSlice.name}
              </span>
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums leading-none",
                  activeSlice.exceeded ? "text-destructive" : "text-foreground",
                )}
              >
                {formatMoney(activeSlice.value)}
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                of {formatMoney(activeSlice.budget)}
              </span>
              {activeSlice.exceeded && (
                <span className="text-[10px] font-semibold text-destructive mt-1 uppercase tracking-wide">
                  Over budget
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                Total spent
              </span>
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums leading-none",
                  overallExceeded ? "text-destructive" : "text-foreground",
                )}
              >
                {formatMoney(totalSpentNum)}
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                of {formatMoney(totalBudgetNum)}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold mt-1",
                  overallExceeded ? "text-destructive" : "text-emerald-500",
                )}
              >
                {overallExceeded
                  ? `${formatMoney(Math.abs(totalRemaining))} over`
                  : `${formatMoney(totalRemaining)} left`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
