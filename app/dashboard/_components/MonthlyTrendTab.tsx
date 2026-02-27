"use client";

import { formatMoney } from "@/lib/formatMoney";
import { formatShortMonth } from "@/lib/month";

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

function deltaDisplay(val: string, invert = false) {
  const n = Number(val);
  if (n === 0)
    return <span className="text-muted-foreground font-mono text-xs">—</span>;
  // invert: for expense, a decrease is good (green)
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

  return (
    <div className="space-y-4">
      {/* Summary strip — current month */}
      <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-md overflow-hidden text-xs">
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
      <div className="rounded-md border border-border overflow-hidden text-xs">
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
            {/* Previous month */}
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

            {/* Current month — highlighted */}
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
      <div className="rounded-md border border-border overflow-hidden text-xs">
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
    </div>
  );
}
