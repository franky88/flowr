"use client";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  balance: { label: "Balance ", color: "var(--chart-1)" },
  income: { label: "Income ", color: "var(--chart-2)" },
  expense: { label: "Expense ", color: "var(--chart-3)" },
} satisfies ChartConfig;

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "15", label: "Last 15 days" },
  { value: "30", label: "Last 30 days" },
];

function formatDayLabel(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.getDate().toString();
}

export default function CashflowAreaChart({ days }: { days: CashflowDay[] }) {
  const [range, setRange] = React.useState("30");

  const filteredDays = React.useMemo(() => {
    if (!days?.length) return [];
    return days.slice(-parseInt(range));
  }, [days, range]);

  if (!days?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredDays} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDayLabel}
            />
            <YAxis tickLine={false} axisLine={false} width={44} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--color-balance)"
              fill="var(--color-balance)"
              fillOpacity={0.25}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              fill="var(--color-income)"
              fillOpacity={0.25}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--color-expense)"
              fill="var(--color-expense)"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
