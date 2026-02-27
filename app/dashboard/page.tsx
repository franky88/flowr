import { getDashboard } from "@/lib/api/dashboard";
import DashboardTxTable from "./_components/DashboardTxTable";
import Link from "next/link";
import { ArrowRight, Check, FileWarning } from "lucide-react";
import { MonthPicker } from "@/components/MonthPicker";
import { defaultMonthYYYYMM } from "@/lib/month";
import { flattenCategoryTree } from "@/lib/categories";
import AddTransaction from "./transactions/AddTransaction";
import { DashboardAddBudget } from "./_components/DashboardAddBudget";
import DashboardBudgetProgress from "./_components/DashboardBudgetProggres";
import { Card } from "./_components/DashboardCard";
import { CashflowAreaChart } from "./_components/DashboardCashFlowChart";
import DashboardIndicator from "./_components/DashboardIndicator";
import { getWorkspaceId } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";
import { listCategories } from "@/lib/api/category";
import { listTransactions } from "@/lib/api/transactions";
import { CopyBudgetsButton } from "@/components/budgets/CopyBudgetsButton";
import { getBudgetPeriodReports } from "@/lib/api/reports";
import { getIntelligence } from "@/lib/api/intelligence";
import { IntelligencePanel } from "./_components/IntelligencePanel";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const sp = await searchParams;

  const defaultMonth = defaultMonthYYYYMM();
  const month = typeof sp.month === "string" ? sp.month : defaultMonth;
  const accountId = typeof sp.accountId === "string" ? sp.accountId : undefined;

  // Resolve workspace first — all data depends on it
  const workspaceId = await getWorkspaceId();

  const [data, accounts, categoriesAll, tx, intelligence] = await Promise.all([
    getDashboard({ workspaceId, month, accountId, mode: "rollup" }),
    listAccounts(workspaceId),
    listCategories(workspaceId),
    listTransactions(workspaceId, month),
    getIntelligence({ workspaceId, month, accountId }).catch((err) => {
      console.error("Intelligence fetch failed:", err.message); // ← shows the real error
      return null;
    }),
  ]);

  console.log("Dashboard data:", { data, intelligence });

  const roots = categoriesAll.filter((c) => c.parent === null);
  const flatTree = flattenCategoryTree(roots);

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your latest transactions and budgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker defaultMonth={month} />
        </div>
      </div>

      <div className="space-y-8">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Income"
            value={data.kpis.income}
            delta={data.kpisCompare.delta.income}
            deltaPct={data.kpisCompare.deltaPct.income}
            previousMonth={data.kpisCompare.previousMonth}
            variant="income"
          />
          <Card
            title="Expense"
            value={data.kpis.expense}
            delta={data.kpisCompare.delta.expense}
            deltaPct={data.kpisCompare.deltaPct.expense}
            previousMonth={data.kpisCompare.previousMonth}
            variant="expense"
          />
          <Card
            title="Net"
            value={data.kpis.net}
            delta={data.kpisCompare.delta.net}
            deltaPct={data.kpisCompare.deltaPct.net}
            previousMonth={data.kpisCompare.previousMonth}
            variant="net"
          />
          <Card
            title="Closing Balance"
            value={data.kpis.closingBalance}
            variant="balance"
          />
        </div>

        {intelligence && <IntelligencePanel data={intelligence} />}

        <div className="w-full">
          <DashboardBudgetProgress kpis={data.kpis} />
        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 gap-4 p-4 border bg-card rounded-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Transactions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Latest transactions
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Link
                  href="/dashboard/transactions"
                  className="group flex items-center gap-1.5 bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80 border rounded-xl"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <AddTransaction
                  month={month}
                  workspaceId={workspaceId}
                  accounts={accounts}
                  categoriesForSelect={flatTree}
                  title="Transaction"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">
              <DashboardTxTable
                transactions={data.recentTransactions.slice(0, 5)}
              />
              <CashflowAreaChart
                openingBalance={Number(data.kpis.openingBalance)}
                month={month}
                transactions={tx}
              />
            </div>
          </div>
        </div>

        {/* Budget Section */}
        <div className="grid grid-cols-1 gap-4 p-4 border bg-card rounded-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-card rounded-xl">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Budget
                </h2>
                <p className="text-sm text-muted-foreground">
                  Monthly budget overview
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Link
                  href="/dashboard/budgets"
                  className="group flex items-center gap-1.5 bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80 border rounded-xl"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <CopyBudgetsButton workspaceId={workspaceId} month={month} />
                <DashboardAddBudget
                  month={month}
                  workspaceId={workspaceId}
                  flatCats={flatTree}
                />
              </div>
            </div>
            <div
              className={`grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0 ${
                data.budgets.totals.isExceeded
                  ? "bg-rose-50 dark:bg-rose-950/20"
                  : "bg-muted/40"
              }`}
            >
              <div className="flex flex-col gap-0.5 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Budget
                </span>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  ₱{Number(data.budgets.totals.budgetResolved).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Spent
                </span>
                <span className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                  ₱{Number(data.budgets.totals.spent).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Remaining
                </span>
                <span
                  className={`text-2xl font-bold ${
                    data.budgets.totals.isExceeded
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  ₱{Number(data.budgets.totals.remaining).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
                {data.budgets.totals.isExceeded ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 dark:text-rose-400">
                    <FileWarning className="h-4 w-4" /> EXCEEDED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4" /> ON TRACK
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">
              <DashboardIndicator budgetRow={data.budgets.rows} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
