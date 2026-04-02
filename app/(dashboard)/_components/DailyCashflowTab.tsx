"use client";

import { formatDate } from "@/lib/formatDate";
import { formatMoney } from "@/lib/formatMoney";
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Colors from globals.css (oklch → hex)
const CHART_COLORS = {
  income: "#c8f05a", // --chart-2  lime-green
  expense: "#f05a5a", // --chart-3  warm red
  balance: "#5a9ef0", // --chart-1  light blue
} as const;

const chartConfig = {
  income: { label: "Income", color: CHART_COLORS.income },
  expense: { label: "Expense", color: CHART_COLORS.expense },
  balance: { label: "Running Balance", color: CHART_COLORS.balance },
} satisfies ChartConfig;

type Props = {
  cashflow: CashflowReport;
};

function dayOfWeek(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DailyCashflowTab({ cashflow }: Props) {
  const { openingBalance, closingBalance, days } = cashflow;

  const totalIncome = days.reduce((s, d) => s + Number(d.income), 0);
  const totalExpense = days.reduce((s, d) => s + Number(d.expense), 0);
  const net = totalIncome - totalExpense;

  const chartData = days.map((d) => ({
    date: shortDate(d.date),
    fullDate: d.date,
    income: Number(d.income),
    expense: Number(d.expense),
    balance: Number(d.balance),
  }));

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-3 sm:grid-cols-5 border border-border rounded-xl overflow-hidden text-xs">
        {[
          {
            label: "Opening Balance",
            val: formatMoney(Number(openingBalance)),
          },
          {
            label: "Total Income",
            val: formatMoney(totalIncome),
            cls: "text-green-600 dark:text-green-400",
          },
          {
            label: "Total Expense",
            val: formatMoney(totalExpense),
            cls: "text-destructive",
          },
          {
            label: "Net",
            val: `${net >= 0 ? "+" : ""}${formatMoney(net)}`,
            cls: "text-primary",
          },
          {
            label: "Closing Balance",
            val: formatMoney(Number(closingBalance)),
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

      {days.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No transactions this month yet.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden text-xs">
            <table className="w-full border-collapse bg-card">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-32">
                    Date
                  </th>
                  <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-10">
                    Day
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Income
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Expense
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Net
                  </th>
                  <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Running Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const hasIncome = Number(day.income) > 0;
                  const hasExpense = Number(day.expense) > 0;
                  const netDay = Number(day.net);
                  const dow = dayOfWeek(day.date);
                  const isWeekend = dow === "Sat" || dow === "Sun";

                  return (
                    <tr
                      key={day.date}
                      className={[
                        "border-b border-border last:border-b-0 transition-colors",
                        hasIncome
                          ? "bg-primary/5 hover:bg-primary/10"
                          : isWeekend
                            ? "bg-accent hover:bg-accent/80"
                            : "hover:bg-accent",
                      ].join(" ")}
                    >
                      <td className="px-3 py-1.5 font-mono">
                        {hasIncome && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 mb-px" />
                        )}
                        <span
                          className={
                            hasIncome
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {formatDate(day.date)}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 font-mono text-[0.7rem] text-muted-foreground">
                        {dow}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">
                        {Number(day.income) > 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            +{formatMoney(Number(day.income))}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">
                        {Number(day.expense) > 0 ? (
                          <span className="text-destructive">
                            {formatMoney(Number(day.expense))}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-medium">
                        <span
                          className={
                            netDay >= 0 ? "text-primary" : "text-destructive"
                          }
                        >
                          {netDay >= 0 ? "+" : "−"}
                          {formatMoney(Math.abs(netDay))}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-semibold">
                        {formatMoney(Number(day.balance))}
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
                    Closing
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem] text-green-600 dark:text-green-400">
                    {formatMoney(totalIncome)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem] text-destructive">
                    {formatMoney(totalExpense)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem] text-primary">
                    {net >= 0 ? "+" : "−"}
                    {formatMoney(Math.abs(net))}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-[0.68rem]">
                    {formatMoney(Number(closingBalance))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-[0.65rem] font-mono text-muted-foreground">
            ● Blue pip = day with income. Formula: Opening Balance + Income −
            Expenses = Running Balance. Only days with transactions appear.
          </p>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Chart 1: Daily income vs expense bars */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
                Daily Income vs Expense
              </p>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
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
                    width={44}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                  <ChartTooltip
                    cursor={{ opacity: 0.06 }}
                    content={(props: any) => {
                      const { active, payload } = props;
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                          <p className="font-semibold text-foreground mb-1">
                            {formatDate(d.fullDate)}
                          </p>
                          {d.income > 0 && (
                            <p style={{ color: CHART_COLORS.income }}>
                              Income:{" "}
                              <span className="font-semibold">
                                {formatMoney(d.income)}
                              </span>
                            </p>
                          )}
                          {d.expense > 0 && (
                            <p style={{ color: CHART_COLORS.expense }}>
                              Expense:{" "}
                              <span className="font-semibold">
                                {formatMoney(d.expense)}
                              </span>
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="income"
                    fill={CHART_COLORS.income}
                    fillOpacity={0.85}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar
                    dataKey="expense"
                    fill={CHART_COLORS.expense}
                    fillOpacity={0.75}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={20}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>

            {/* Chart 2: Running balance area */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
                Running Balance
              </p>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
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
                    width={44}
                  />
                  <ChartTooltip
                    cursor={{ opacity: 0.06 }}
                    content={(props: any) => {
                      const { active, payload } = props;
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                          <p className="font-semibold text-foreground mb-1">
                            {formatDate(d.fullDate)}
                          </p>
                          <p style={{ color: CHART_COLORS.balance }}>
                            Balance:{" "}
                            <span className="font-semibold">
                              {formatMoney(d.balance)}
                            </span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke={CHART_COLORS.balance}
                    strokeWidth={2}
                    fill={CHART_COLORS.balance}
                    fillOpacity={0.08}
                    dot={false}
                    activeDot={{
                      r: 3,
                      fill: CHART_COLORS.balance,
                      strokeWidth: 0,
                    }}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
