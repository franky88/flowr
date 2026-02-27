"use client";

import { formatDate } from "@/lib/formatDate";
import { formatMoney } from "@/lib/formatMoney";

type Props = {
  cashflow: CashflowReport;
};

function dayOfWeek(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export default function DailyCashflowTab({ cashflow }: Props) {
  const { openingBalance, closingBalance, days } = cashflow;

  const totalIncome = days.reduce((s, d) => s + Number(d.income), 0);
  const totalExpense = days.reduce((s, d) => s + Number(d.expense), 0);
  const net = totalIncome - totalExpense;

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-3 sm:grid-cols-5 border border-border rounded-md overflow-hidden text-xs">
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
          <div className="rounded-md border border-border overflow-hidden text-xs">
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
        </>
      )}
    </div>
  );
}
