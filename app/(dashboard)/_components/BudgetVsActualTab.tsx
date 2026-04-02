"use client";

import { formatMoney } from "@/lib/formatMoney";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Props = {
  month: string;
  budgetMonitor: BudgetMonitorReport;
  dashboard: DashboardResponse;
};

function pct(spent: string, budget: string | null): number {
  if (!budget || Number(budget) === 0) return 0;
  return Math.min((Number(spent) / Number(budget)) * 100, 100);
}

function progClass(pctVal: number, isExceeded: boolean): string {
  if (isExceeded) return "bg-destructive";
  if (pctVal >= 90) return "bg-yellow-500";
  return "bg-primary";
}

function fmtRemaining(remaining: string | null, isExceeded: boolean) {
  if (!remaining)
    return <span className="text-muted-foreground font-mono text-xs">—</span>;
  const n = Number(remaining);
  if (isExceeded)
    return (
      <span className="text-destructive font-mono text-xs">
        ({formatMoney(Math.abs(n))})
      </span>
    );
  return (
    <span className="text-green-600 dark:text-green-400 font-mono text-xs">
      {formatMoney(n)}
    </span>
  );
}

// Colors from globals.css chart variables (oklch → hex equivalents)
const CHART_COLORS = {
  safe: "#5a9ef0", // --chart-1  light blue
  warning: "#4a6fd4", // --chart-4  mid blue
  exceeded: "#f05a5a", // --chart-3  warm red
  remaining: "#c8f05a", // --chart-2  lime-green
} as const;

function chartFill(isExceeded: boolean, pctVal: number): string {
  if (isExceeded) return CHART_COLORS.exceeded;
  if (pctVal >= 90) return CHART_COLORS.warning;
  return CHART_COLORS.safe;
}

const stressChartConfig = {
  pct: { label: "% Used", color: CHART_COLORS.safe },
} satisfies ChartConfig;

const stackedChartConfig = {
  Spent: { label: "Spent", color: CHART_COLORS.safe },
  Remaining: { label: "Remaining", color: CHART_COLORS.remaining },
} satisfies ChartConfig;

export default function BudgetVsActualTab({
  month,
  budgetMonitor,
  dashboard,
}: Props) {
  const { totals, rows } = budgetMonitor;
  const incomeBase = dashboard.kpis.incomeBase;

  const overCount = rows.filter((r) => r.isExceeded).length;
  const totalPct =
    Number(totals.budgetResolved) > 0
      ? (Number(totals.spent) / Number(totals.budgetResolved)) * 100
      : 0;

  const chartData = rows
    .filter((r) => r.budgetResolved && Number(r.budgetResolved) > 0)
    .map((r) => ({
      name:
        r.categoryName.length > 14
          ? r.categoryName.slice(0, 13) + "…"
          : r.categoryName,
      fullName: r.categoryName,
      Budget: Number(r.budgetResolved),
      Spent: Number(r.spent),
      isExceeded: r.isExceeded,
    }));

  const stressData = [...chartData]
    .sort((a, b) => b.Spent / b.Budget - a.Spent / a.Budget)
    .map((r) => ({
      ...r,
      pct: Math.round((r.Spent / r.Budget) * 100),
    }));

  const stackedData = chartData.map((r) => ({
    ...r,
    Remaining: Math.max(r.Budget - r.Spent, 0),
  }));

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-xl overflow-hidden text-xs">
        {[
          { label: "Income Base", val: formatMoney(Number(incomeBase)) },
          {
            label: "Total Budgeted",
            val: formatMoney(Number(totals.budgetResolved)),
          },
          {
            label: "Total Spent",
            val: formatMoney(Number(totals.spent)),
            cls: "text-destructive",
          },
          {
            label: "Remaining",
            val: formatMoney(Number(totals.remaining)),
            cls: totals.isExceeded
              ? "text-destructive"
              : "text-green-600 dark:text-green-400",
          },
          {
            label: "Used",
            val: `${totalPct.toFixed(1)}%`,
            cls: "text-primary",
          },
          {
            label: "Exceeded",
            val: `${overCount} categor${overCount === 1 ? "y" : "ies"}`,
            cls: overCount > 0 ? "text-destructive" : "text-muted-foreground",
          },
        ].map((cell, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 p-2.5 border-r border-border last:border-r-0"
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              {cell.label}
            </span>
            <span className={`font-mono font-semibold ${cell.cls ?? ""}`}>
              {cell.val}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden text-xs">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-52">
                Category
              </th>
              <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-20">
                Type
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Budget
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Spent
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Remaining
              </th>
              <th className="px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-40">
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = pct(row.spent, row.budgetResolved);
              const pClass = progClass(p, row.isExceeded);
              const fillWidth = row.isExceeded ? 100 : Math.round(p);

              return (
                <tr
                  key={row.categoryId}
                  className="border-b border-border last:border-b-0 hover:bg-accent transition-colors"
                >
                  <td className="px-3 py-1.5 text-muted-foreground">
                    {row.categoryName}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.ruleType === "fixed" ? (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-mono font-medium uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        fixed
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-mono font-medium uppercase bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        % base
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono">
                    {row.budgetResolved ? (
                      formatMoney(Number(row.budgetResolved))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono">
                    {formatMoney(Number(row.spent))}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {fmtRemaining(row.remaining, row.isExceeded)}
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pClass}`}
                          style={{ width: `${fillWidth}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono text-[0.67rem] min-w-7 text-right ${
                          row.isExceeded
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {row.isExceeded
                          ? `${Math.round((Number(row.spent) / Number(row.budgetResolved!)) * 100)}%`
                          : `${Math.round(p)}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-muted border-t border-border">
              <td
                colSpan={2}
                className="px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide"
              >
                Total
              </td>
              <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem]">
                {formatMoney(Number(totals.budgetResolved))}
              </td>
              <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem]">
                {formatMoney(Number(totals.spent))}
              </td>
              <td className="px-3 py-2 text-right">
                {fmtRemaining(totals.remaining, totals.isExceeded)}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        totals.isExceeded
                          ? "bg-destructive"
                          : totalPct >= 90
                            ? "bg-yellow-500"
                            : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(totalPct, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[0.67rem] text-muted-foreground min-w-7 text-right">
                    {Math.round(totalPct)}%
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Chart 1: Horizontal % of budget used, sorted by stress */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
            Budget Stress — % Used
          </p>
          <ChartContainer config={stressChartConfig} className="h-55 w-full">
            <BarChart
              layout="vertical"
              data={stressData}
              margin={{ top: 0, right: 36, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <ChartTooltip
                cursor={{ opacity: 0.08 }}
                content={(props: any) => {
                  const { active, payload } = props;
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                      <p className="font-semibold text-foreground mb-1">
                        {d.fullName}
                      </p>
                      <p className="text-muted-foreground">
                        Used:{" "}
                        <span className="text-foreground font-semibold">
                          {d.pct}%
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Spent:{" "}
                        <span className="text-foreground font-semibold">
                          {formatMoney(d.Spent)}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Budget:{" "}
                        <span className="text-foreground font-semibold">
                          {formatMoney(d.Budget)}
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="pct" radius={[0, 3, 3, 0]} maxBarSize={16}>
                {stressData.map((entry, index) => (
                  <Cell
                    key={`stress-${index}`}
                    fill={chartFill(
                      entry.isExceeded,
                      (entry.Spent / entry.Budget) * 100,
                    )}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Chart 2: Stacked bar — Spent + Remaining per category */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
            Spent vs Remaining
          </p>
          <ChartContainer config={stackedChartConfig} className="h-55 w-full">
            <BarChart
              data={stackedData}
              margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
                tick={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <ChartTooltip
                cursor={{ opacity: 0.08 }}
                content={(props: any) => {
                  const { active, payload } = props;
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                      <p className="font-semibold text-foreground mb-1">
                        {d.fullName}
                      </p>
                      <p className="text-muted-foreground">
                        Spent:{" "}
                        <span className="text-foreground font-semibold">
                          {formatMoney(d.Spent)}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Remaining:{" "}
                        <span className="text-foreground font-semibold">
                          {formatMoney(d.Remaining)}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Budget:{" "}
                        <span className="text-foreground font-semibold">
                          {formatMoney(d.Budget)}
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="Spent"
                stackId="a"
                radius={[0, 0, 0, 0]}
                maxBarSize={28}
              >
                {stackedData.map((entry, index) => (
                  <Cell
                    key={`spent-${index}`}
                    fill={chartFill(
                      entry.isExceeded,
                      (entry.Spent / entry.Budget) * 100,
                    )}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="Remaining"
                stackId="a"
                fill={CHART_COLORS.remaining}
                fillOpacity={0.3}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
