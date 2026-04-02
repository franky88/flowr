"use client";

import { useState, useTransition } from "react";
import { formatMoney } from "@/lib/formatMoney";
import { formatDate } from "@/lib/formatDate";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Colors from globals.css chart variables (oklch → hex)
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

type Props = {
  month: string;
  accountId: string | null;
  workspaceId: string;
};

function monthBounds(month: string) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    first: `${month}-01`,
    last: `${month}-${pad(last)}`,
    daysInMonth: last,
  };
}

function buildPresets(month: string) {
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { label: "1st–10th", from: `${month}-01`, to: `${month}-10` },
    { label: "11th–24th", from: `${month}-11`, to: `${month}-24` },
    { label: "25th–end", from: `${month}-25`, to: `${month}-${pad(lastDay)}` },
    {
      label: "Full month",
      from: `${month}-01`,
      to: `${month}-${pad(lastDay)}`,
    },
  ];
}

function daysBetween(from: string, to: string) {
  return (
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) +
    1
  );
}

function progClass(isExceeded: boolean, p: number) {
  if (isExceeded) return "bg-destructive";
  if (p >= 90) return "bg-yellow-500";
  return "bg-primary";
}

export default function PayPeriodTab({ month, accountId, workspaceId }: Props) {
  const { first, last, daysInMonth } = monthBounds(month);
  const presets = buildPresets(month);

  const [dateFrom, setDateFrom] = useState(presets[1].from);
  const [dateTo, setDateTo] = useState(presets[1].to);
  const [activePreset, setActivePreset] = useState<number | null>(1);
  const [report, setReport] = useState<BudgetPeriodReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function applyPreset(idx: number) {
    const p = presets[idx];
    setDateFrom(p.from);
    setDateTo(p.to);
    setActivePreset(idx);
  }

  function handleDateChange(which: "from" | "to", val: string) {
    if (which === "from") setDateFrom(val);
    else setDateTo(val);
    setActivePreset(null);
  }

  function load() {
    setError(null);
    startTransition(async () => {
      try {
        const params = new URLSearchParams({
          workspaceId,
          date_from: dateFrom,
          date_to: dateTo,
        });
        const res = await fetch(
          `/api/reports/budget-period?${params.toString()}`,
        );
        if (!res.ok) throw new Error(await res.text());
        const data: BudgetPeriodReport = await res.json();
        setReport(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      }
    });
  }

  const days = daysBetween(dateFrom, dateTo);
  const ratio = days / daysInMonth;

  // Derived chart data — only built when report is available
  const chartData =
    report?.rows
      .filter((r) => Number(r.periodBudget) > 0)
      .map((r) => {
        const spent = Number(r.spent);
        const budget = Number(r.periodBudget);
        const pctVal = budget > 0 ? (spent / budget) * 100 : 0;
        return {
          name:
            r.categoryName.length > 14
              ? r.categoryName.slice(0, 13) + "…"
              : r.categoryName,
          fullName: r.categoryName,
          Spent: spent,
          Budget: budget,
          Remaining: Math.max(budget - spent, 0),
          pct: Math.round(pctVal),
          isExceeded: r.isExceeded,
        };
      }) ?? [];

  const stressData = [...chartData].sort(
    (a, b) => b.Spent / b.Budget - a.Spent / a.Budget,
  );

  return (
    <div className="space-y-3">
      {/* Period bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border border-border rounded-xl bg-card text-xs">
        <div className="flex gap-1.5 flex-wrap">
          {presets.map((p, i) => (
            <button
              key={p.label}
              onClick={() => applyPreset(i)}
              className={[
                "px-2.5 py-1 rounded border font-mono text-[0.68rem] transition-colors",
                activePreset === i
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-input text-muted-foreground hover:border-primary hover:text-primary",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={dateFrom}
            min={first}
            max={dateTo}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="bg-muted border border-input text-foreground px-2 py-1 rounded font-mono text-[0.7rem] outline-none focus:border-primary"
          />
          <span className="text-muted-foreground">→</span>
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            max={last}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="bg-muted border border-input text-foreground px-2 py-1 rounded font-mono text-[0.7rem] outline-none focus:border-primary"
          />
        </div>
        <span className="font-mono text-muted-foreground text-[0.68rem] ml-auto hidden sm:block">
          {days} days · {(ratio * 100).toFixed(1)}% of month
        </span>
        <button
          onClick={load}
          disabled={isPending}
          className="px-3.5 py-1 bg-primary text-primary-foreground rounded font-mono text-[0.7rem] hover:opacity-85 disabled:opacity-50 transition-opacity"
        >
          {isPending ? "Loading…" : "Load"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 text-xs font-mono">
          {error}
        </div>
      )}

      {!report && !isPending && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Select a pay period and click{" "}
          <span className="font-semibold">Load</span> to view pro-rated budget
          vs spend.
        </div>
      )}

      {isPending && (
        <div className="text-center py-12 text-muted-foreground text-sm animate-pulse">
          Loading…
        </div>
      )}

      {report && !isPending && (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-xl overflow-hidden text-xs">
            {[
              {
                label: "Period",
                val: `${formatDate(dateFrom)} → ${formatDate(dateTo)}`,
              },
              {
                label: "Days",
                val: `${report.periodDays} / ${report.daysInMonth}`,
              },
              {
                label: "Ratio",
                val: `${(Number(report.periodRatio) * 100).toFixed(1)}%`,
                cls: "text-primary",
              },
              {
                label: "Period Budget",
                val: formatMoney(
                  report.rows.reduce((s, r) => s + Number(r.periodBudget), 0),
                ),
              },
              {
                label: "Period Spent",
                val: formatMoney(
                  report.rows.reduce((s, r) => s + Number(r.spent), 0),
                ),
                cls: "text-destructive",
              },
              {
                label: "Remaining",
                val: (() => {
                  const rem = report.rows.reduce(
                    (s, r) => s + Number(r.remaining),
                    0,
                  );
                  return rem < 0
                    ? `(${formatMoney(Math.abs(rem))})`
                    : formatMoney(rem);
                })(),
                cls: (() => {
                  const rem = report.rows.reduce(
                    (s, r) => s + Number(r.remaining),
                    0,
                  );
                  return rem < 0
                    ? "text-destructive"
                    : "text-green-600 dark:text-green-400";
                })(),
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
                  <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Category
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Monthly Budget
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-primary">
                    Period Budget
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Spent
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Remaining
                  </th>
                  <th className="px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-36">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => {
                  const p =
                    Number(row.periodBudget) > 0
                      ? Math.min(
                          (Number(row.spent) / Number(row.periodBudget)) * 100,
                          100,
                        )
                      : 0;
                  const pClass = progClass(row.isExceeded, p);
                  const displayPct = row.isExceeded
                    ? Math.round(
                        (Number(row.spent) / Number(row.periodBudget)) * 100,
                      )
                    : Math.round(p);

                  return (
                    <tr
                      key={row.categoryId}
                      className="border-b border-border last:border-b-0 hover:bg-accent transition-colors"
                    >
                      <td className="px-3 py-1.5 text-muted-foreground">
                        {row.categoryName}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                        {formatMoney(Number(row.monthlyBudget))}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-medium text-primary">
                        {formatMoney(Number(row.periodBudget))}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">
                        {formatMoney(Number(row.spent))}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">
                        {row.isExceeded ? (
                          <span className="text-destructive">
                            ({formatMoney(Math.abs(Number(row.remaining)))})
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">
                            {formatMoney(Number(row.remaining))}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pClass}`}
                              style={{ width: `${Math.min(p, 100)}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono text-[0.67rem] min-w-7 text-right ${row.isExceeded ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {displayPct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted border-t border-border">
                  <td className="px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide">
                    Total
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground font-semibold text-[0.68rem]">
                    {formatMoney(
                      report.rows.reduce(
                        (s, r) => s + Number(r.monthlyBudget),
                        0,
                      ),
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem] text-primary">
                    {formatMoney(
                      report.rows.reduce(
                        (s, r) => s + Number(r.periodBudget),
                        0,
                      ),
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem]">
                    {formatMoney(
                      report.rows.reduce((s, r) => s + Number(r.spent), 0),
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem]">
                    {(() => {
                      const rem = report.rows.reduce(
                        (s, r) => s + Number(r.remaining),
                        0,
                      );
                      return rem < 0 ? (
                        <span className="text-destructive">
                          ({formatMoney(Math.abs(rem))})
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">
                          {formatMoney(rem)}
                        </span>
                      );
                    })()}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-[0.65rem] font-mono text-muted-foreground">
            * Period budget = monthly budget × ({report.periodDays} ÷{" "}
            {report.daysInMonth} days). Spending filtered to transactions within
            the selected date range.
          </p>

          {/* Charts row */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Chart 1: Horizontal % of period budget used, sorted by stress */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
                  Period Budget Stress — % Used
                </p>
                <ChartContainer
                  config={stressChartConfig}
                  className="h-55 w-full"
                >
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
                              Period Budget:{" "}
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
                <ChartContainer
                  config={stackedChartConfig}
                  className="h-55 w-full"
                >
                  <BarChart
                    data={chartData}
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
                              Period Budget:{" "}
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
                      {chartData.map((entry, index) => (
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
          )}
        </>
      )}
    </div>
  );
}
