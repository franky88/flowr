"use client";

import { formatDate } from "@/lib/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatMoney } from "@/lib/formatMoney";
import { MoreHorizontalIcon } from "hugeicons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DashboardTxTable = ({
  transactions,
}: {
  transactions: DashboardTransaction[];
}) => {
  const columns: ColumnDef<DashboardTransaction>[] = [
    {
      id: "type-icon",
      header: "",
      size: 20,
      cell: ({ row }) => {
        const isIncome = row.original.type === "income";
        return (
          <div
            className={`p-1.5 rounded w-fit ${
              isIncome
                ? "bg-emerald-50 dark:bg-emerald-950/20"
                : "bg-rose-50 dark:bg-rose-950/20"
            }`}
          >
            {isIncome ? (
              <ArrowUpRight
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
              />
            ) : (
              <ArrowDownRight
                size={16}
                className="text-rose-600 dark:text-rose-400"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.original.categoryName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatDate(row.original.date)}
        </span>
      ),
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) =>
        row.original.note ? (
          <span className="text-sm text-muted-foreground truncate max-w-40 block">
            {row.original.note}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-sm">—</span>
        ),
    },
    {
      accessorKey: "amount",
      header: () => <span className="block text-right">Amount</span>,
      cell: ({ row }) => {
        const isIncome = row.original.type === "income";
        return (
          <span
            className={`block text-right font-semibold tabular-nums text-sm ${
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isIncome ? "+" : "−"}
            {formatMoney(Number(row.original.amount))}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: () => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (!transactions.length) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No transactions this month.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default DashboardTxTable;
