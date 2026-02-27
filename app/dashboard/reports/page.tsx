import { apiFetch } from "@/lib/api";
import { getWorkspaceId } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";
import { getBudgetMonitor } from "@/lib/api/budgets";
import { getDashboard } from "@/lib/api/dashboard";
import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { AccountPicker } from "@/app/dashboard/cashflow/AccountPicker";
import ReportsTabs from "../_components/ReportsTabs";

async function getCashflow(
  workspaceId: string,
  month: string,
  accountId?: string,
): Promise<CashflowReport> {
  const qs = new URLSearchParams({ month });
  if (accountId) qs.set("accountId", accountId);
  return apiFetch<CashflowReport>(
    `/v1/workspaces/${workspaceId}/reports/cashflow/?${qs.toString()}`,
    { method: "GET", cache: "no-store" },
  );
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const month = typeof sp.month === "string" ? sp.month : defaultMonthYYYYMM();
  const accountId = typeof sp.accountId === "string" ? sp.accountId : undefined;
  const workspaceId = await getWorkspaceId();

  const [accounts, budgetMonitor, cashflow, dashboard] = await Promise.all([
    listAccounts(workspaceId),
    getBudgetMonitor(workspaceId, month, accountId, "rollup"),
    getCashflow(workspaceId, month, accountId),
    getDashboard({ workspaceId, month, accountId, mode: "rollup" }),
  ]);

  return (
    <main className="max-w-full p-4 sm:p-6 pb-16 space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Budget vs Actual · Pay-Period · Daily Cashflow · Monthly Trend
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AccountPicker accounts={accounts} />
          <MonthPicker defaultMonth={month} />
        </div>
      </header>

      <ReportsTabs
        month={month}
        accountId={accountId ?? null}
        workspaceId={workspaceId}
        budgetMonitor={budgetMonitor}
        cashflow={cashflow}
        dashboard={dashboard}
      />
    </main>
  );
}
