import { apiFetch } from "@/lib/api";
import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { AccountPicker } from "./AccountPicker";
import CashFlowTable from "./CashFlowTable";
import CashflowAreaChart from "./CashflowAreaChart";
import { getWorkspaceId } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";
import CashflowBarChart from "./CashFlowBarChart";

async function getCashflow(
  workspaceId: string,
  month: string,
  accountId?: string,
): Promise<CashflowReport> {
  const qs = new URLSearchParams({ month });
  if (accountId) qs.set("accountId", accountId);
  return apiFetch<CashflowReport>(
    `/v1/workspaces/${workspaceId}/reports/cashflow/?${qs.toString()}`,
    {
      method: "GET",
      rawErrorBody: true,
    },
  );
}

export default async function CashflowPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const defaultMonth = defaultMonthYYYYMM();

  const month = typeof sp.month === "string" ? sp.month : defaultMonth;
  const accountId = typeof sp.accountId === "string" ? sp.accountId : undefined;
  const workspaceId = await getWorkspaceId();

  const [accounts, report] = await Promise.all([
    listAccounts(workspaceId),
    getCashflow(workspaceId, month, accountId),
  ]);

  const chartDays = report.days.map((d) => ({
    ...d,
    date: typeof d.date === "string" ? d.date : new Date(d.date).toISOString(),
  }));

  const netChange =
    Number(report.closingBalance) - Number(report.openingBalance);
  const isPositiveNet = netChange >= 0;

  return (
    <main className="max-w-full space-y-6 sm:space-y-8 p-4 sm:p-6">
      {/* Page Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cashflow
          </h1>
          <p className="text-sm text-muted-foreground">
            Running balance = opening balance + daily income − daily expenses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MonthPicker defaultMonth={defaultMonth} />
          <AccountPicker accounts={accounts} />
        </div>
      </header>

      {/* KPI Summary Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 border divide-x divide-y sm:divide-y-0 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-xl overflow-hidden">
        <div className="flex flex-col gap-0.5 px-4 sm:px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Opening
          </span>
          <span className="text-lg sm:text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400 truncate">
            ₱{Number(report.openingBalance).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 px-4 sm:px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Closing
          </span>
          <span className="text-lg sm:text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400 truncate">
            ₱{Number(report.closingBalance).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 px-4 sm:px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Change
          </span>
          <span
            className={`text-lg sm:text-2xl font-bold tabular-nums truncate ${
              isPositiveNet
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            {isPositiveNet ? "+" : "-"}₱{Math.abs(netChange).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 px-4 sm:px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Days
          </span>
          <span className="text-lg sm:text-2xl font-bold tabular-nums text-foreground">
            {report.days.length}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              days
            </span>
          </span>
        </div>
      </section>

      {/* Content Grid — stacked on mobile, side-by-side on md+ */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Table */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold tracking-tight">
              Daily Running Balance
            </h2>
            <p className="text-sm text-muted-foreground">
              Day-by-day breakdown for the selected period
            </p>
          </div>

          {report.days.length === 0 ? (
            <div className="bg-muted/40 px-5 py-10 text-center rounded-xl border">
              <p className="text-sm font-medium text-muted-foreground">
                No activity recorded for this month.
              </p>
            </div>
          ) : (
            /* Negative margin trick so table scrolls edge-to-edge on mobile
               without losing card padding elsewhere */
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <CashFlowTable cashFlow={report.days} />
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold tracking-tight">
              Cashflow Trend
            </h2>
            <p className="text-sm text-muted-foreground">
              Daily running cashflow visualized as an area chart
            </p>
          </div>

          <div className="bg-card rounded-xl border p-3 sm:p-4">
            <CashflowAreaChart days={chartDays} />
          </div>
          <div className="bg-card rounded-xl border p-3 sm:p-4">
            <CashflowBarChart days={chartDays} />
          </div>
        </div>
      </section>
    </main>
  );
}
