import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { flattenCategoryTree } from "@/lib/categories";
import TransactionTable from "./TransactionTable";
import AddTransaction from "./AddTransaction";
import { Badge } from "@/components/ui/badge";
import { getWorkspaceId, getWorkspaceMembers } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";
import { listTransactions } from "@/lib/api/transactions";
import { listCategories } from "@/lib/api/category";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const defaultMonth = defaultMonthYYYYMM();
  const month = typeof sp.month === "string" ? sp.month : defaultMonth;
  const workspaceId = await getWorkspaceId();

  const [accounts, categoriesAll, txs, members] = await Promise.all([
    listAccounts(workspaceId),
    listCategories(workspaceId),
    listTransactions(workspaceId, month),
    getWorkspaceMembers(workspaceId),
  ]);

  const roots = categoriesAll.filter((c) => c.parent === null);
  const flatTree = flattenCategoryTree(roots);
  const categoriesForSelect = flatTree;

  const memberMap = Object.fromEntries(
    members.map((m) => [
      m.userId,
      { name: m.name, role: m.role, email: m.email, imageUrl: m.imageUrl },
    ]),
  );

  return (
    <div className="px-4 sm:px-6 lg:px-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:flex-wrap mb-6 sm:mb-8">
        <div className="space-y-1 sm:space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Transactions are the single source of truth. Filtered by month.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <MonthPicker defaultMonth={defaultMonth} />
          <AddTransaction
            month={month}
            workspaceId={workspaceId}
            accounts={accounts}
            categoriesForSelect={categoriesForSelect}
            title="Transaction"
          />
        </div>
      </div>

      {/* List Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-sm sm:text-base">
            Transactions for {month}
          </h2>
          <Badge variant="outline" className="text-sm text-muted-foreground">
            {txs.length} items
          </Badge>
        </div>

        {txs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No transactions for this month.
          </p>
        ) : (
          /* Negative margin scroll trick: table scrolls edge-to-edge on
             narrow screens without clipping the surrounding page padding */
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TransactionTable
              workspaceId={workspaceId}
              transactions={txs}
              accounts={accounts}
              categories={categoriesAll}
              month={month}
              memberMap={memberMap}
            />
          </div>
        )}
      </section>
    </div>
  );
}
