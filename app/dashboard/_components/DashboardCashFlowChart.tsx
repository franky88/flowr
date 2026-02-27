"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CashflowAreaChartProps {
  month: string; // "YYYY-MM"
  openingBalance: number | string; // from kpis.openingBalance
  transactions: Transaction[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildDailyData(
  transactions: Transaction[],
  openingBalance: number,
  month: string,
) {
  // Group by date
  const byDate: Record<string, { income: number; expense: number }> = {};
  for (const tx of transactions) {
    if (!byDate[tx.date]) byDate[tx.date] = { income: 0, expense: 0 };
    const amount = parseFloat(tx.amount);
    if (tx.type === "INCOME") byDate[tx.date].income += amount;
    else byDate[tx.date].expense += amount;
  }

  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  let runningBalance = openingBalance;
  const data = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
    const day = byDate[dateStr] ?? { income: 0, expense: 0 };

    runningBalance += day.income - day.expense;

    data.push({
      day: d,
      date: dateStr,
      income: day.income,
      expense: day.expense,
      // null for future days — line stops at today, no projection
      balance:
        dateStr <= todayStr ? parseFloat(runningBalance.toFixed(2)) : null,
    });
  }

  return data;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (d?.balance === null) return null;

  return (
    <div className="border border-border bg-card px-3 py-2 shadow-lg text-sm min-w-40">
      <p className="text-xs text-muted-foreground mb-1.5">{d.date}</p>
      {d.income > 0 && (
        <p className="text-emerald-500 text-xs">+{fmt(d.income)} income</p>
      )}
      {d.expense > 0 && (
        <p className="text-destructive text-xs">−{fmt(d.expense)} expense</p>
      )}
      <p className="text-primary font-semibold mt-1.5 text-sm">
        Balance: {fmt(d.balance)}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CashflowAreaChart({
  month,
  openingBalance,
  transactions,
}: CashflowAreaChartProps) {
  const opening =
    typeof openingBalance === "string"
      ? parseFloat(openingBalance)
      : openingBalance;

  const data = useMemo(
    () => buildDailyData(transactions, opening, month),
    [transactions, opening, month],
  );

  const validData = data.filter((d) => d.balance !== null);
  const balances = validData.map((d) => d.balance as number);
  const minBalance = Math.min(...balances, 0);
  const maxBalance = Math.max(...balances, 0);

  const monthLabel = new Date(`${month}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const netChange = (validData.at(-1)?.balance ?? opening) - opening;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Running Balance
            </CardTitle>
            <CardDescription>{monthLabel}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Net change</p>
            <p
              className={`text-sm font-semibold tabular-nums ${
                netChange >= 0 ? "text-emerald-500" : "text-destructive"
              }`}
            >
              {netChange >= 0 ? "+" : ""}
              {fmt(netChange)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />

            {/* Red zero line — only rendered when balance goes negative */}
            {minBalance < 0 && (
              <ReferenceLine
                y={0}
                stroke="var(--color-destructive)"
                strokeDasharray="4 2"
                strokeOpacity={0.5}
              />
            )}

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={4} // label every 5th day
            />

            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
              }
              domain={[
                Math.floor(minBalance * 1.05),
                Math.ceil(maxBalance * 1.05),
              ]}
              width={42}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              dot={false}
              connectNulls={false} // stops line at today — no future projection
              activeDot={{
                r: 4,
                fill: "var(--color-primary)",
                stroke: "var(--color-background)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
