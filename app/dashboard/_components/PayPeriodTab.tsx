"use client";

import { useState, useTransition } from "react";
import { formatMoney } from "@/lib/formatMoney";
import { formatDate } from "@/lib/formatDate";

type Props = {
  month: string;
  accountId: string | null;
  workspaceId: string;
};

// Parse "YYYY-MM" into first and last day strings
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

type Preset = {
  label: string;
  from: (month: string) => string;
  to: (month: string) => string;
};

function buildPresets(
  month: string,
): { label: string; from: string; to: string }[] {
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

  return (
    <div className="space-y-3">
      {/* Period bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border border-border rounded-md bg-card text-xs">
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
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 text-xs font-mono">
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
          <div className="grid grid-cols-3 sm:grid-cols-6 border border-border rounded-md overflow-hidden text-xs">
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
          <div className="rounded-md border border-border overflow-hidden text-xs">
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
        </>
      )}
    </div>
  );
}
