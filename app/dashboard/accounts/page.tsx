import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AccountsTable from "./AccountsTable";
import { createAccount } from "@/actions/accounts";
import { getWorkspaceId } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";

export default async function AccountsPage() {
  const workspaceId = await getWorkspaceId();
  const accounts = await listAccounts(workspaceId);

  console.log("workspace", workspaceId);
  console.log("accounts", accounts);

  return (
    <main className="p-6 max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Create accounts like BPI, Cash, GCash. Each transaction belongs to an
          account.
        </p>
      </header>

      {/* Create */}
      <section>
        <h2 className="font-medium mb-3">Add account</h2>
        <form action={createAccount} className="flex gap-2">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <Input
            name="name"
            placeholder="e.g. BPI, Cash"
            maxLength={120}
            required
          />
          <Button variant={"default"}>Add</Button>
        </form>
      </section>

      {/* List */}
      <section>
        <h2 className="font-medium mb-3">Your accounts</h2>

        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No accounts yet.</p>
        ) : (
          <AccountsTable data={accounts} workspaceId={workspaceId} />
        )}
      </section>
    </main>
  );
}
