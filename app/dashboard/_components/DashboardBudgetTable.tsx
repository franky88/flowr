"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "./DataTable";
import { Check, FileWarning } from "lucide-react";

const DashboardBudgetTable = ({
  budgets,
  totals,
}: {
  budgets: DashboardBudgetRow[];
  totals: DashboardBudgets;
}) => {
  const columns: ColumnDef<DashboardBudgetRow>[] = [
    {
      accessorKey: "categoryName",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 font-medium">{row.original.categoryName}</div>
      ),
    },
    {
      accessorKey: "budgetResolved",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Budget
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-right font-medium text-blue-700 dark:text-blue-400">
          ₱{Number(row.original.budgetResolved).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "spent",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Spent
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-right font-medium text-rose-700 dark:text-rose-400">
          ₱{Number(row.original.spent).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "remaining",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Remaining
        </div>
      ),
      cell: ({ row }) => {
        const remaining = Number(row.original.remaining);
        const exceeded = remaining < 0;
        return (
          <div
            className={`px-3 py-2 text-right font-medium ${
              exceeded
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            ₱{Math.abs(remaining).toLocaleString()}
            {exceeded && (
              <span className="ml-1 text-xs text-rose-400">over</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isExceeded",
      header: () => (
        <div className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const exceeded = row.original.isExceeded;
        return (
          <div className="px-3 py-2">
            {exceeded ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                <FileWarning className="h-3.5 w-3.5" />
                EXCEEDED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                ON TRACK
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={budgets} />
    </div>
  );
};

export default DashboardBudgetTable;
