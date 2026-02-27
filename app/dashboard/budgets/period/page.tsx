// app/dashboard/budgets/period/page.tsx
import { getWorkspaceId } from "@/lib/api/workspace";
import { getBudgetPeriod } from "@/lib/api/budgets";
import { BudgetPeriodClient } from "./BudgetPeriodClient";

function defaultRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: firstDay.toISOString().slice(0, 10),
    to: lastDay.toISOString().slice(0, 10),
  };
}

export default async function BudgetPeriodPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const range = defaultRange();
  const dateFrom = sp.dateFrom ?? range.from;
  const dateTo = sp.dateTo ?? range.to;
  const accountId = sp.accountId;

  const workspaceId = await getWorkspaceId();
  const report = await getBudgetPeriod(
    workspaceId,
    dateFrom,
    dateTo,
    accountId,
  );

  return (
    <BudgetPeriodClient
      report={report}
      dateFrom={dateFrom}
      dateTo={dateTo}
      workspaceId={workspaceId}
    />
  );
}
