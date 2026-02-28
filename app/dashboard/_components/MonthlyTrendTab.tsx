"use client";

import { formatMoney } from "@/lib/formatMoney";
import { formatShortMonth } from "@/lib/month";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
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
  warning: "#4a6fd4", // --chart-4  mid blue
} as const;

const barChartConfig = {
  income: { label: "Income", color: CHART_COLORS.income },
  expense: { label: "Expense", color: CHART_COLORS.expense },
} satisfies ChartConfig;

const rateChartConfig = {
  rate: { label: "Savings Rate", color: CHART_COLORS.balance },
} satisfies ChartConfig;

type Props = {
  month: string;
  dashboard: DashboardResponse;
};

function savingsRate(income: string, expense: string): number {
  const inc = Number(income);
  if (inc === 0) return 0;
  return ((inc - Number(expense)) / inc) * 100;
}

function rateColor(rate: number): string {
  if (rate >= 20) return "text-green-600 dark:text-green-400";
  if (rate >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-destructive";
}

function rateHex(rate: number): string {
  if (rate >= 20) return "#22c55e";
  if (rate >= 10) return "#eab308";
  return CHART_COLORS.expense;
}

function deltaDisplay(val: string, invert = false) {
  const n = Number(val);
  if (n === 0)
    return <span className="text-muted-foreground font-mono text-xs">—</span>;
  const isGood = invert ? n < 0 : n > 0;
  return (
    <span
      className={`font-mono text-xs font-medium ${isGood ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
    >
      {n > 0 ? "+" : ""}
      {formatMoney(Math.abs(n))}
      {n > 0 ? " ▲" : " ▼"}
    </span>
  );
}

function deltaPctDisplay(val: string | null, invert = false) {
  if (!val)
    return <span className="text-muted-foreground font-mono text-xs">—</span>;
  const n = Number(val);
  if (n === 0)
    return <span className="text-muted-foreground font-mono text-xs">0%</span>;
  const isGood = invert ? n < 0 : n > 0;
  return (
    <span
      className={`font-mono text-xs ${isGood ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
    >
      {n > 0 ? "+" : ""}
      {n.toFixed(1)}%
    </span>
  );
}

export default function MonthlyTrendTab({ month, dashboard }: Props) {
  const { kpis, kpisCompare } = dashboard;
  const { previousMonth, previous, delta, deltaPct } = kpisCompare;

  const currRate = savingsRate(kpis.income, kpis.expense);
  const prevRate = savingsRate(previous.income, previous.expense);

  const netSavings = Number(kpis.income) - Number(kpis.expense);
  const prevNetSavings = Number(previous.income) - Number(previous.expense);

  // Grouped bar chart data — one group per metric, two bars each
  const barData = [
    {
      metric: "Income",
      [formatShortMonth(previousMonth)]: Number(previous.income),
      [formatShortMonth(month)]: Number(kpis.income),
    },
    {
      metric: "Expense",
      [formatShortMonth(previousMonth)]: Number(previous.expense),
      [formatShortMonth(month)]: Number(kpis.expense),
    },
    {
      metric: "Net",
      [formatShortMonth(previousMonth)]: prevNetSavings,
      [formatShortMonth(month)]: netSavings,
    },
  ];

  const prevMonthLabel = formatShortMonth(previousMonth);
  const currMonthLabel = formatShortMonth(month);

  const groupedBarConfig = {
    [prevMonthLabel]: { label: prevMonthLabel, color: CHART_COLORS.warning },
    [currMonthLabel]: { label: currMonthLabel, color: CHART_COLORS.balance },
  } satisfies ChartConfig;

  // Savings rate radial data
  const rateData = [
    {
      name: prevMonthLabel,
      rate: Math.max(prevRate, 0),
      fill: rateHex(prevRate),
    },
    {
      name: currMonthLabel,
      rate: Math.max(currRate, 0),
      fill: rateHex(currRate),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary strip — current month */}
      <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-xl overflow-hidden text-xs">
        {[
          {
            label: "Income",
            val: formatMoney(Number(kpis.income)),
            cls: "text-green-600 dark:text-green-400",
          },
          {
            label: "Expense",
            val: formatMoney(Number(kpis.expense)),
            cls: "text-destructive",
          },
          {
            label: "Net Savings",
            val: formatMoney(netSavings),
            cls: "text-primary",
          },
          {
            label: "Savings Rate",
            val: `${currRate.toFixed(1)}%`,
            cls: rateColor(currRate),
          },
          { label: "Opening", val: formatMoney(Number(kpis.openingBalance)) },
          { label: "Closing", val: formatMoney(Number(kpis.closingBalance)) },
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

      {/* Month-by-month table */}
      <div className="rounded-xl border border-border overflow-hidden text-xs">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground w-28">
                Month
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Opening
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Income
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Expense
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Net Savings
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Rate
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Closing
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-accent transition-colors">
              <td className="px-3 py-1.5 font-mono text-muted-foreground">
                {formatShortMonth(previousMonth)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                —
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-green-600 dark:text-green-400">
                {formatMoney(Number(previous.income))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-destructive">
                {formatMoney(Number(previous.expense))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono font-semibold text-primary">
                {formatMoney(prevNetSavings)}
              </td>
              <td
                className={`px-3 py-1.5 text-right font-mono ${rateColor(prevRate)}`}
              >
                {prevRate.toFixed(1)}%
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                —
              </td>
            </tr>
            <tr className="bg-primary/5 border-b border-border hover:bg-primary/10 transition-colors">
              <td className="px-3 py-1.5 font-mono font-semibold">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 mb-px" />
                <span className="text-primary">{formatShortMonth(month)}</span>
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                {formatMoney(Number(kpis.openingBalance))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-green-600 dark:text-green-400">
                {formatMoney(Number(kpis.income))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-destructive">
                {formatMoney(Number(kpis.expense))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono font-semibold text-primary">
                {formatMoney(netSavings)}
              </td>
              <td
                className={`px-3 py-1.5 text-right font-mono font-medium ${rateColor(currRate)}`}
              >
                {currRate.toFixed(1)}%
              </td>
              <td className="px-3 py-1.5 text-right font-mono font-semibold">
                {formatMoney(Number(kpis.closingBalance))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Delta comparison table */}
      <div className="rounded-xl border border-border overflow-hidden text-xs">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Metric
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                {formatShortMonth(previousMonth)}
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                {formatShortMonth(month)}
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Change (₱)
              </th>
              <th className="text-right px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                Change (%)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-accent transition-colors">
              <td className="px-3 py-1.5 font-medium">Income</td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                {formatMoney(Number(previous.income))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {formatMoney(Number(kpis.income))}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaDisplay(delta.income)}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaPctDisplay(deltaPct.income)}
              </td>
            </tr>
            <tr className="border-b border-border hover:bg-accent transition-colors">
              <td className="px-3 py-1.5 font-medium">Expense</td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                {formatMoney(Number(previous.expense))}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {formatMoney(Number(kpis.expense))}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaDisplay(delta.expense, true)}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaPctDisplay(deltaPct.expense, true)}
              </td>
            </tr>
            <tr className="hover:bg-accent transition-colors">
              <td className="px-3 py-1.5 font-medium">Net</td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                {formatMoney(prevNetSavings)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {formatMoney(netSavings)}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaDisplay(delta.net)}
              </td>
              <td className="px-3 py-1.5 text-right">
                {deltaPctDisplay(deltaPct.net)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[0.65rem] font-mono text-muted-foreground">
        * Savings rate = (Income − Expense) ÷ Income. Target: ≥20% green ·
        10–19% amber · &lt;10% red. Full multi-month trend requires switching
        months via the month picker.
      </p>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Chart 1: Grouped bars — Income / Expense / Net, prev vs current */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
            Month-over-Month Comparison
          </p>
          <ChartContainer config={groupedBarConfig} className="h-55 w-full">
            <BarChart
              data={barData}
              margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
              barCategoryGap="28%"
              barGap={3}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="metric"
                tick={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "hsl(var(--muted-foreground))",
                }}
                axisLine={false}
                tickLine={false}
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
                  const metric = payload[0]?.payload?.metric;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                      <p className="font-semibold text-foreground mb-1">
                        {metric}
                      </p>
                      {payload.map((p: any, i: number) => (
                        <p key={i} style={{ color: p.fill }}>
                          {p.name}:{" "}
                          <span className="font-semibold">
                            {formatMoney(p.value)}
                          </span>
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey={prevMonthLabel}
                fill={CHART_COLORS.warning}
                fillOpacity={0.7}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey={currMonthLabel}
                fill={CHART_COLORS.balance}
                fillOpacity={0.9}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Chart 2: Savings rate — radial bars side by side */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-3">
            Savings Rate
          </p>
          <ChartContainer config={rateChartConfig} className="h-55 w-full">
            <RadialBarChart
              data={rateData}
              innerRadius="30%"
              outerRadius="90%"
              startAngle={180}
              endAngle={0}
              barSize={20}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="rate"
                background={{ fill: "hsl(var(--border))" }}
                cornerRadius={4}
              >
                {rateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <ChartTooltip
                cursor={false}
                content={(props: any) => {
                  const { active, payload } = props;
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg font-mono text-xs space-y-0.5">
                      <p className="font-semibold text-foreground">{d.name}</p>
                      <p style={{ color: d.fill }}>
                        Rate:{" "}
                        <span className="font-semibold">
                          {d.rate.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
            </RadialBarChart>
          </ChartContainer>
          {/* Manual legend since RadialBarChart legend is unreliable */}
          <div className="flex justify-center gap-6 mt-1">
            {rateData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 font-mono text-[0.65rem]"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold" style={{ color: d.fill }}>
                  {d.rate.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
