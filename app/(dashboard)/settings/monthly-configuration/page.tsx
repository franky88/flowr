import { AccountPicker } from "@/components/shared/AccountPicker";
import { MonthPicker } from "@/components/shared/MonthPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MonhtlyConfigurationProps {
  defaultMonth: string;
  accounts: { id: string; name: string }[];
  firstAccountId?: string;
  accountName?: string;
  month?: string;
  workspaceId: string;
  cfg?: {
    income_base: number | null;
    opening_balance: number | null;
    updated_at: string;
  } | null;
}

const MonthlyConfiguration = ({
  defaultMonth,
  accounts,
  firstAccountId,
  accountName,
  month,
  workspaceId,
  cfg,
}: MonhtlyConfigurationProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Month Config</h2>
          <p className="text-sm text-muted-foreground">
            Set <b>income base</b> and <b>opening balance</b> per account per
            month.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <MonthPicker defaultMonth={defaultMonth} />
          {accounts.length > 0 && (
            <AccountPicker
              accounts={accounts}
              defaultAccountId={firstAccountId}
            />
          )}
        </div>
      </div>

      {!firstAccountId ? (
        <p className="text-sm text-muted-foreground">
          Create at least one account first.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Editing: <b>{accountName}</b> • <b>{month}</b>
          </p>
          <form action={saveAccountMonthConfig} className="grid gap-3">
            <Input type="hidden" name="workspaceId" value={workspaceId} />
            <Input type="hidden" name="month" value={month} />
            <Input type="hidden" name="accountId" value={accountId} />

            <label className="grid gap-1">
              <span className="text-sm">Income base</span>
              <Input
                name="incomeBase"
                inputMode="decimal"
                placeholder="e.g. 10000.00"
                defaultValue={cfg?.income_base ?? ""}
              />
              <span className="text-xs text-muted-foreground">
                This is used as the base for calculating progress against
                income-based budgets. It does not affect any calculations in the
                dashboard.
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
                Starting balance for cashflow this month.
              </span>
            </label>

            <Button className="w-fit">Save</Button>
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
        </>
      )}
    </section>
  );
};

export default MonthlyConfiguration;
