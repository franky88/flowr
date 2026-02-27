import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { getBudgetMonitor, listBudgets } from "@/lib/api/budgets";
import BudgetsTable from "./BudgetsTable";
import PieChartPage from "./PieChartPage";
import { formatMoney } from "@/lib/formatMoney";
import { getWorkspaceId } from "@/lib/api/workspace";
import { listCategories } from "@/lib/api/category";
import { BudgetsTabs } from "@/components/budgets/BudgetTabs";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const month = typeof sp.month === "string" ? sp.month : defaultMonthYYYYMM();
  const mode = "rollup";
  const accountId = typeof sp.accountId === "string" ? sp.accountId : undefined;
  const workspaceId = await getWorkspaceId();

  const [categories, budgets, monitor] = await Promise.all([
    listCategories(workspaceId),
    listBudgets(workspaceId, month),
    getBudgetMonitor(workspaceId, month, accountId, mode),
  ]);

  const isExceeded = monitor.totals.isExceeded;
  const remaining = parseFloat(monitor.totals.remaining);
  const spent = parseFloat(monitor.totals.spent);
  const budgetTotal = parseFloat(monitor.totals.budgetResolved);
  const usedPct =
    budgetTotal > 0 ? Math.min((spent / budgetTotal) * 100, 100) : 0;

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 lg:px-6 py-4 space-y-6">
        <BudgetsTabs active="monthly" />
        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              Budgets
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your spending against monthly targets
            </p>
          </div>
          <div className="self-start sm:self-auto">
            <MonthPicker defaultMonth={month} />
          </div>
        </div>

        {/* ── Summary strip ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Budget */}
          <div className="border bg-card rounded-xl px-4 sm:px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">
              Total Budget
            </p>
            <p className="text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatMoney(budgetTotal)}
            </p>
          </div>

          {/* Spent */}
          <div className="border bg-card px-4 sm:px-5 rounded-xl py-4">
            <p className="text-xs font-medium uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">
              Spent
            </p>
            <p className="text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatMoney(spent)}
            </p>
            {/* Mini progress bar */}
            <div className="mt-2 h-1 bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${usedPct}%`,
                  backgroundColor: isExceeded ? "#ef4444" : "#10b981",
                }}
              />
            </div>
          </div>

          {/* Remaining / Over Budget */}
          <div
            className={`border rounded-xl px-4 sm:px-5 py-4 ${
              isExceeded
                ? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40"
                : "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40"
            }`}
          >
            <p
              className={`text-xs font-medium uppercase tracking-widest mb-1 ${
                isExceeded
                  ? "text-red-400 dark:text-red-500"
                  : "text-emerald-500 dark:text-emerald-400"
              }`}
            >
              {isExceeded ? "Over Budget" : "Remaining"}
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${
                isExceeded
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isExceeded
                ? `−${formatMoney(Math.abs(remaining))}`
                : formatMoney(remaining)}
            </p>
          </div>
        </div>

        {/* ── Main panel: table + chart ────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4 items-start">
          {/* Table card */}
          <div className="mb-4 p-4 border bg-card rounded-xl overflow-hidden">
            <div className="mb-4 border-b pb-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-700 dark:text-stone-300">
                Category Breakdown
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                {mode === "rollup"
                  ? "Subcategory spend rolled up to parent"
                  : "Exact category spend only"}
              </p>
            </div>
            {/* Horizontal scroll wrapper for the table on small screens */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <BudgetsTable
                month={month}
                categories={categories}
                budgets={budgets}
                monitor={monitor}
                mode={mode}
                workspaceId={workspaceId}
              />
            </div>
          </div>

          {/* Chart card — shown below table on mobile, beside it on xl */}
          <div className="p-4 border bg-card rounded-xl overflow-hidden">
            <div className="mb-4 border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="text-base sm:text-lg font-semibold text-stone-700 dark:text-stone-300">
                Spend Distribution
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                Where your money went this month
              </p>
            </div>
            <div className="p-2 sm:p-4">
              <PieChartPage data={monitor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
