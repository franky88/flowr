"use client";

import { formatMoney } from "@/lib/formatMoney";

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

export default function BudgetVsActualTab({
  month,
  budgetMonitor,
  dashboard,
}: Props) {
  const { totals, rows } = budgetMonitor;
  const incomeBase = dashboard.kpis.incomeBase;

  // Group rows: find which are "parent-level" rows (no indent needed) vs children
  // The API returns rows flat with categoryName; rollup mode aggregates parents
  // We detect children by checking if any row name looks nested — but since the
  // backend returns flat rows in rollup mode, we just render them flat.
  // In "rollup" mode rows may include parent summaries. Render as-is.

  const overCount = rows.filter((r) => r.isExceeded).length;
  const totalPct =
    Number(totals.budgetResolved) > 0
      ? (Number(totals.spent) / Number(totals.budgetResolved)) * 100
      : 0;

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-md overflow-hidden text-xs">
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
      <div className="rounded-md border border-border overflow-hidden text-xs">
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
    </div>
  );
}
