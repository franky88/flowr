// app/dashboard/budgets/period/BudgetPeriodClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BudgetsTabs } from "@/components/budgets/BudgetTabs";

type Props = {
  report: BudgetPeriodReport;
  dateFrom: string;
  dateTo: string;
  workspaceId: string;
};

function fmt(val: string) {
  return parseFloat(val).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
}

function PctBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const over = budget > 0 && spent > budget;
  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          over ? "bg-destructive" : "bg-primary",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function BudgetPeriodClient({
  report,
  dateFrom,
  dateTo,
  workspaceId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState(dateFrom);
  const [to, setTo] = useState(dateTo);

  const totalBudget = report.rows.reduce(
    (s, r) => s + parseFloat(r.periodBudget),
    0,
  );
  const totalSpent = report.rows.reduce((s, r) => s + parseFloat(r.spent), 0);
  const totalRemaining = totalBudget - totalSpent;
  const exceededCount = report.rows.filter((r) => r.isExceeded).length;

  function applyRange() {
    startTransition(() => {
      const params = new URLSearchParams({ dateFrom: from, dateTo: to });
      router.push(`/dashboard/budgets/period?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-4">
      <BudgetsTabs active="period" />
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Pay Period Budget
        </h1>
        <p className="text-sm text-muted-foreground">
          Monthly budgets pro-rated to your selected pay period.
        </p>
      </div>

      {/* Date range controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">
            From
          </label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">
            To
          </label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-40"
          />
        </div>
        <Button onClick={applyRange} disabled={isPending} size="sm">
          {isPending ? "Loading…" : "Apply"}
        </Button>
        {/* Period summary pill */}
        <span className="text-xs text-muted-foreground ml-auto self-end pb-1">
          {report.periodDays} days / {report.daysInMonth} —{" "}
          <span className="font-mono">
            {(parseFloat(report.periodRatio) * 100).toFixed(1)}%
          </span>{" "}
          of month
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="Period Budget"
          value={fmt(totalBudget.toFixed(2))}
        />
        <SummaryCard label="Spent" value={fmt(totalSpent.toFixed(2))} />
        <SummaryCard
          label="Remaining"
          value={fmt(totalRemaining.toFixed(2))}
          variant={totalRemaining < 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="Over Budget"
          value={`${exceededCount} categor${exceededCount === 1 ? "y" : "ies"}`}
          variant={exceededCount > 0 ? "danger" : "default"}
        />
      </div>

      {/* Table */}
      {report.rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No budgets found for {report.month}. Add budgets first.
        </p>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">Period</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="w-32">Usage</TableHead>
                <TableHead className="w-16">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.rows.map((row) => (
                <BudgetRow key={row.categoryId} row={row} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function BudgetRow({ row }: { row: BudgetPeriodRow }) {
  const spent = parseFloat(row.spent);
  const budget = parseFloat(row.periodBudget);
  const remaining = parseFloat(row.remaining);

  return (
    <TableRow className={cn(row.isExceeded && "bg-destructive/5")}>
      <TableCell className="font-medium">{row.categoryName}</TableCell>
      <TableCell className="text-right text-muted-foreground text-sm font-mono">
        {fmt(row.monthlyBudget)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm">
        {fmt(row.periodBudget)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm">
        {fmt(row.spent)}
      </TableCell>
      <TableCell
        className={cn(
          "text-right font-mono text-sm font-medium",
          row.isExceeded ? "text-destructive" : "text-foreground",
        )}
      >
        {fmt(row.remaining)}
      </TableCell>
      <TableCell>
        <PctBar spent={spent} budget={budget} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {row.ruleType}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

function SummaryCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "danger";
}) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span
        className={cn(
          "text-lg font-semibold font-mono",
          variant === "danger" && "text-destructive",
        )}
      >
        {value}
      </span>
    </div>
  );
}
