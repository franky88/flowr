"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createBudgetAction,
  deleteBudgetAction,
  updateBudgetAction,
} from "@/actions/budget";
import type { CategoryNode } from "@/lib/categories";
import { flattenCategoryTree, uniqueById } from "@/lib/categories";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Check, Edit, FileWarningIcon, Trash2 } from "lucide-react";
import { BudgetModeToggle } from "./BudgetModeToggle";
import { Button } from "@/components/ui/button";
import { AddBudgetDialog } from "./AddBudget";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DeleteItem from "@/components/DeleteItem";
import { CopyBudgetsButton } from "@/components/budgets/CopyBudgetsButton";
import { toast } from "sonner";

function EditBudgetPopover({
  budget,
  workspaceId,
  onSuccess,
}: {
  budget: Budget;
  workspaceId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [ruleType, setRuleType] = useState<"fixed" | "percent">(
    budget.rule_type as "fixed" | "percent",
  );
  const [value, setValue] = useState(String(budget.value));

  const handleSave = () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed <= 0) return;

    startTransition(async () => {
      await updateBudgetAction(workspaceId, budget.id, {
        rule_type: ruleType,
        value: String(parsed),
      });
      toast.success("Budget updated successfully.");
      setOpen(false);
      onSuccess();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-500"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-4 space-y-4 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-lg rounded-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Edit Budget — {budget.category_name}
        </p>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Rule Type</Label>
          <Select
            value={ruleType}
            onValueChange={(v) => setRuleType(v as "fixed" | "percent")}
          >
            <SelectTrigger className="h-8 text-sm rounded-xl border-stone-200 dark:border-stone-700 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="fixed">Fixed (₱)</SelectItem>
              <SelectItem value="percent">Percent (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {ruleType === "percent" ? "Percent of Income" : "Fixed Amount"}
          </Label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {ruleType === "percent" ? "%" : "₱"}
            </span>
            <Input
              type="number"
              min={0}
              step={ruleType === "percent" ? 0.1 : 1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-7 h-8 text-sm rounded-xl border-stone-200 dark:border-stone-700"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setOpen(false);
              }}
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-xs rounded-xl"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 px-3 text-xs rounded-xl bg-stone-900 text-white hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function BudgetsTable({
  month,
  categories,
  monitor,
  budgets,
  mode,
  workspaceId,
}: {
  month: string;
  categories: CategoryNode[];
  monitor: BudgetMonitorReport;
  budgets: Budget[];
  mode: "leaf" | "rollup";
  workspaceId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const flatCats = useMemo(() => {
    return uniqueById(flattenCategoryTree(categories));
  }, [categories]);

  const onDelete = (id: string) => {
    startTransition(async () => {
      await deleteBudgetAction(workspaceId, id);
    });
  };

  const monitorByCategoryId = useMemo(() => {
    return new Map(monitor.rows.map((r) => [r.categoryId, r]));
  }, [monitor.rows]);

  console.log("monitor", monitor);

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "category",
      header: () => (
        <div className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 font-medium">
          {row.original.category_name}
        </div>
      ),
    },
    {
      accessorKey: "rule_type",
      header: () => (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rule
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2">
          <span className="bg-muted px-2 py-0.5 text-xs font-semibold tracking-wide text-muted-foreground">
            {row.original.rule_type.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Allocation
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2">
          <span className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground">
            {row.original.rule_type === "percent"
              ? `${row.original.value}%`
              : `₱${Number(row.original.value).toLocaleString()}`}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "resolved_amount",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Budget
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3 py-2 text-right font-medium text-blue-700 dark:text-blue-400">
          ₱{Number(row.original.resolved_amount).toLocaleString()}
        </div>
      ),
    },
    {
      id: "spent",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Spent
        </div>
      ),
      cell: ({ row }) => {
        const m = monitorByCategoryId.get(row.original.category);
        const spent = m?.spent ?? "0.00";
        return (
          <div className="px-3 py-2 text-right font-medium text-rose-700 dark:text-rose-400">
            ₱{Number(spent).toLocaleString()}
          </div>
        );
      },
    },
    {
      id: "remaining",
      header: () => (
        <div className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Remaining
        </div>
      ),
      cell: ({ row }) => {
        const m = monitorByCategoryId.get(row.original.category);
        const remaining =
          m?.remaining ?? row.original.resolved_amount ?? "0.00";
        const exceeded = m?.isExceeded ?? false;

        return (
          <div
            className={`px-3 py-2 text-right font-medium ${
              exceeded
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            ₱{Number(remaining).toLocaleString()}
          </div>
        );
      },
    },
    {
      id: "status",
      header: () => (
        <div className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const m = monitorByCategoryId.get(row.original.category);
        const exceeded = m?.isExceeded ?? false;

        return (
          <div className="px-3 py-2">
            {exceeded ? (
              <span className="inline-flex items-center gap-1.5 bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl">
                <FileWarningIcon className="h-3.5 w-3.5" />
                EXCEEDED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl">
                <Check className="h-3.5 w-3.5" />
                ON TRACK
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="px-3 py-2 text-right">
          <EditBudgetPopover
            budget={row.original}
            workspaceId={workspaceId}
            onSuccess={() => router.refresh()}
          />
          <DeleteItem
            onDelete={() => onDelete(row.original.id)}
            itemName={row.original.category_name ?? "budget"}
            itemId={row.original.id}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Totals + Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 border bg-card rounded-xl overflow-hidden">
          <div className="flex flex-col gap-0.5 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Budget Allocated
            </span>
            <span className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
              {Number(monitor.percentSummary.allocatedPercent).toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-col gap-0.5 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Remaining
            </span>
            <span
              className={`text-2xl font-bold tabular-nums ${
                monitor.percentSummary.isOverAllocated
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {Number(monitor.percentSummary.remainingPercent).toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-col gap-0.5 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <span
              className={`text-sm font-semibold mt-1 inline-flex items-center gap-1  ${
                monitor.percentSummary.isOverAllocated
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  monitor.percentSummary.isOverAllocated
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`}
              />
              {monitor.percentSummary.isOverAllocated
                ? "Over Allocated"
                : "On Track"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CopyBudgetsButton workspaceId={workspaceId} month={month} />
          <AddBudgetDialog
            flatCats={flatCats}
            isPending={isPending}
            onSubmit={({ categoryId, ruleType, amount }) => {
              startTransition(async () => {
                await createBudgetAction(workspaceId, {
                  month,
                  category: categoryId,
                  rule_type: ruleType,
                  value: amount,
                });
                router.refresh();
              });
            }}
          />
        </div>
      </div>

      <div className="px-5 py-3 border rounded-xl bg-card space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Percent budget usage</span>
          <span>
            {Number(monitor.percentSummary.allocatedPercent).toFixed(1)}% of
            100%
          </span>
        </div>
        <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              monitor.percentSummary.isOverAllocated
                ? "bg-red-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${Math.min(Number(monitor.percentSummary.allocatedPercent), 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={budgets} />
      </div>
    </div>
  );
}
