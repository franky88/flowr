"use client";

import { formatDate } from "@/lib/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { useMemo } from "react";
import {
  CategoryNode,
  flattenCategoryTree,
  uniqueById,
} from "@/lib/categories";
import TxActions from "./TxActions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { request } from "node:http";
import { useAuth } from "@clerk/nextjs";

type MemberDetails = {
  name: string;
  role: string;
  email: string;
  imageUrl?: string;
};

interface TransactionTableProps {
  workspaceId: string;
  transactions: Transaction[];
  accounts: Account[];
  categories: CategoryNode[];
  month: string;
  memberMap: Record<string, MemberDetails>;
}

const TransactionTable = ({
  workspaceId,
  transactions,
  accounts,
  categories,
  month,
  memberMap,
}: TransactionTableProps) => {
  const accountById = useMemo(() => {
    return new Map(accounts.map((a) => [a.id, a.name]));
  }, [accounts]);

  const categoryById = useMemo(() => {
    return new Map(uniqueById(categories).map((c) => [c.id, c.name]));
  }, [categories]);

  const categoriesForSelect = useMemo(() => {
    const roots = categories.filter((c) => c.parent === null);
    return flattenCategoryTree(roots);
  }, [categories]);

  const { userId } = useAuth();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-sm text-muted-foreground tabular-nums">
          {formatDate(row.original.date)}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Type
        </div>
      ),
      cell: ({ row }) => {
        const isIncome = row.original.type === "INCOME";
        return (
          <div className="px-3 py-2">
            {isIncome ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                INCOME
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
                EXPENSE
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "account",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          Account
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      accessorFn: (row) => row.account,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const account = row.getValue(columnId) as { id: string; name: string };
        return account?.id === filterValue;
      },
      cell: ({ row }) => (
        <div className="px-3 py-2">
          <span className="bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {accountById.get(row.original.account) ?? "—"}
            {/* {row.original.account ?? "—"} */}
          </span>
        </div>
      ),
    },
    {
      id: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      accessorFn: (row) => categoryById.get(row.category) ?? "",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <div className="px-3 py-2">
            {value ? (
              <span className="bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {value}
              </span>
            ) : (
              <span className="italic text-muted-foreground opacity-40">—</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Amount
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div
            className={`px-3 py-2 text-right font-semibold tabular-nums ${
              row.original.type === "INCOME"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            {row.original.type === "INCOME" ? "+" : "-"}₱
            {Number(row.original.amount).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Note
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 max-w-50 truncate text-sm text-muted-foreground">
          {row.original.note || <span className="italic opacity-40">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "created_by",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Created by
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {row.original.created_by ? (
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage
                  src={memberMap[row.original.created_by]?.imageUrl}
                  alt={memberMap[row.original.created_by]?.name ?? "Unknown"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {memberMap[row.original.created_by]?.name ?? "Unknown"}
            </div>
          ) : (
            "Unknown"
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const canChange =
          row.original.created_by === userId ||
          row.original.created_by === null;
        return (
          <div className="px-3 py-2">
            <TxActions
              workspaceId={workspaceId}
              month={month}
              tx={row.original}
              accounts={accounts}
              categoriesForSelect={categoriesForSelect}
              canChange={canChange}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default TransactionTable;
