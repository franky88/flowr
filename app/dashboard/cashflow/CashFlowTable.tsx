"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface CashFlowTableProps {
  cashFlow: CashflowDay[];
}

const CashFlowTable = ({ cashFlow }: CashFlowTableProps) => {
  const columns: ColumnDef<CashflowDay>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-sm text-muted-foreground tabular-nums">
          {formatDate(row.original.date)}
        </div>
      ),
    },
    {
      accessorKey: "income",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Income
        </div>
      ),
      cell: ({ row }) => {
        const value = Number(row.original.income);
        const hasValue = value > 0;
        return (
          <div
            className={`px-3 py-2 text-right font-semibold tabular-nums ${
              hasValue
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground opacity-40"
            }`}
          >
            {hasValue ? `+₱${value.toLocaleString()}` : "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "expense",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Expense
        </div>
      ),
      cell: ({ row }) => {
        const value = Number(row.original.expense);
        const hasValue = value > 0;
        return (
          <div
            className={`px-3 py-2 text-right font-semibold tabular-nums ${
              hasValue
                ? "text-rose-700 dark:text-rose-400"
                : "text-muted-foreground opacity-40"
            }`}
          >
            {hasValue ? `-₱${value.toLocaleString()}` : "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "net",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Net
        </div>
      ),
      cell: ({ row }) => {
        const value = Number(row.original.net);
        const isPositive = value >= 0;
        return (
          <div
            className={`px-3 py-2 text-right font-semibold tabular-nums ${
              isPositive
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            {isPositive ? "+" : "-"}₱{Math.abs(value).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Balance
        </div>
      ),
      cell: ({ row }) => {
        const value = Number(row.original.balance);
        const isPositive = value >= 0;
        return (
          <div className="px-3 py-2 text-right">
            <span
              className={`inline-block px-2 py-0.5 text-sm font-bold tabular-nums ${
                isPositive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              }`}
            >
              ₱{Math.abs(value).toLocaleString()}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={cashFlow} />
    </div>
  );
};

export default CashFlowTable;
