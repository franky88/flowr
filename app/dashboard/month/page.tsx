import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { AccountPicker } from "./AccountPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listAccounts } from "@/lib/api/accounts";
import { getWorkspaceId } from "@/lib/api/workspace";

async function getAccountMonthConfig(
  workspaceId: string,
  month: string,
  accountId: string,
) {
  const qs = new URLSearchParams({ month, accountId });
  return apiFetch<AccountMonthConfig | null>(
    `/v1/workspaces/${workspaceId}/config/?${qs.toString()}`,
    { method: "GET", rawErrorBody: true },
  );
}

async function saveAccountMonthConfig(formData: FormData) {
  "use server";

  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const month = String(formData.get("month") ?? "").trim();
  const accountId = String(formData.get("accountId") ?? "").trim();
  const incomeBase = String(formData.get("incomeBase") ?? "").trim();
  const openingBalance = String(formData.get("openingBalance") ?? "").trim();

  if (!workspaceId || !month || !accountId) return;

  const qs = new URLSearchParams({ month, accountId });

  await apiFetch(`/v1/workspaces/${workspaceId}/config/?${qs.toString()}`, {
    method: "PUT",
    body: JSON.stringify({
      month,
      accountId,
      income_base: incomeBase || "0.00",
      opening_balance: openingBalance || "0.00",
    }),
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/month");
  revalidatePath(`/dashboard/month?month=${month}&accountId=${accountId}`);
  revalidatePath("/dashboard/cashflow");
  revalidatePath(`/dashboard/cashflow?month=${month}&accountId=${accountId}`);
  revalidatePath("/dashboard/budgets");
  revalidatePath(`/dashboard/budgets?month=${month}&accountId=${accountId}`);
}

export default async function MonthPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const defaultMonth = defaultMonthYYYYMM();
  const month = typeof sp.month === "string" ? sp.month : defaultMonth;
  const workspaceId = await getWorkspaceId();

  const accounts = await listAccounts(workspaceId);
  const firstAccountId = accounts[0]?.id ?? "";

  const accountId =
    typeof sp.accountId === "string" ? sp.accountId : firstAccountId;

  if (!firstAccountId) {
    return (
      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Month Settings</h1>
        <p className="text-sm text-muted-foreground">
          Create at least one account first.
        </p>
      </main>
    );
  }

  const cfg = await getAccountMonthConfig(workspaceId, month, accountId);

  const accountName =
    accounts.find((a) => a.id === accountId)?.name ?? "Account";

  return (
    <main className="p-6 max-w-2xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Month Settings</h1>
            <p className="text-sm text-muted-foreground">
              Set <b>income base</b> and <b>opening balance</b> per account per
              month.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <MonthPicker defaultMonth={defaultMonth} />
            <AccountPicker
              accounts={accounts}
              defaultAccountId={firstAccountId}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Editing: <b>{accountName}</b> • <b>{month}</b>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="font-medium">Config</h2>

        <form action={saveAccountMonthConfig} className="grid gap-3">
          <Input type="hidden" name="workspaceId" value={workspaceId} />
          <Input type="hidden" name="month" value={month} />
          <Input type="hidden" name="accountId" value={accountId} />

          <label className="grid gap-1">
            <span className="text-sm">Income base</span>
            <Input
              name="incomeBase"
              inputMode="decimal"
              placeholder="e.g. 50000.00"
              defaultValue={cfg?.income_base ?? ""}
            />
            <span className="text-xs text-muted-foreground">
              Optional: if you want budgets to use total income base, you can
              sum these per account.
            </span>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Opening balance</span>
            <Input
              name="openingBalance"
              inputMode="decimal"
              placeholder="e.g. 10000.00"
              defaultValue={cfg?.opening_balance ?? ""}
            />
            <span className="text-xs text-muted-foreground">
              Used by cashflow as the starting balance for this account in this
              month.
            </span>
          </label>

          <Button className="px-3 py-2 w-fit">Save</Button>
        </form>

        {cfg ? (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(cfg.updated_at).toLocaleString()}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            No config yet — saving will create it.
          </p>
        )}
      </section>
    </main>
  );
}
