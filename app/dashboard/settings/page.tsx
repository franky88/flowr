import { getWorkspaceId } from "@/lib/api/workspace";
import { listAccounts } from "@/lib/api/accounts";
import { listCategories } from "@/lib/api/category";
import { inviteMemberAction, removeMemberAction } from "@/actions/workspace";
import { createAccount } from "@/actions/accounts";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { defaultMonthYYYYMM } from "@/lib/month";
import { MonthPicker } from "@/components/MonthPicker";
import { AccountPicker } from "../month/AccountPicker";
import AccountsTable from "../accounts/AccountsTable";
import { CategoryNode, uniqueById } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { EditCategoryPopover } from "@/components/settings/EditCategoryPopover";

function CategoryTree({
  nodes,
  onDeleteAction,
  categoryOptions,
}: {
  nodes: CategoryNode[];
  onDeleteAction: (formData: FormData) => Promise<void>;
  categoryOptions: { id: string; name: string }[];
}) {
  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center justify-between py-2 px-2 border bg-card rounded-xl">
            <span className="font-medium">{n.name}</span>
            <div className="flex items-center gap-1">
              <EditCategoryPopover
                id={n.id}
                currentName={n.name}
                currentParentId={n.parent ?? null}
                categoryOptions={categoryOptions}
              />
              <DeleteCategoryButton
                id={n.id}
                name={n.name}
                deleteAction={onDeleteAction}
              />
            </div>
          </div>
          {(n.children?.length ?? 0) > 0 && (
            <div className="mt-3 pl-4 border-l-5 border-border">
              <CategoryTree
                nodes={n.children!}
                onDeleteAction={onDeleteAction}
                categoryOptions={categoryOptions}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

async function getWorkspaceMembers(workspaceId: string) {
  return apiFetch<
    {
      userId: string;
      role: string;
      name: string;
      email: string | null;
      imageUrl: string | null;
    }[]
  >(`/v1/workspaces/${workspaceId}/members/`);
}

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
  const openingBalance = String(formData.get("openingBalance") ?? "").trim();

  if (!workspaceId || !month || !accountId) return;

  const qs = new URLSearchParams({ month, accountId });
  await apiFetch(`/v1/workspaces/${workspaceId}/config/?${qs.toString()}`, {
    method: "PUT",
    body: JSON.stringify({
      month,
      accountId,
      opening_balance: openingBalance || "0.00",
    }),
    rawErrorBody: true,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/cashflow");
  revalidatePath("/dashboard/budgets");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const defaultMonth = defaultMonthYYYYMM();
  const month = typeof sp.month === "string" ? sp.month : defaultMonth;

  const workspaceId = await getWorkspaceId();

  const [accounts, members, allCategories] = await Promise.all([
    listAccounts(workspaceId),
    getWorkspaceMembers(workspaceId),
    listCategories(workspaceId),
  ]);

  const categoryRoots = allCategories.filter((c) => c.parent === null);
  const categoryOptions = uniqueById(allCategories).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  async function createCategory(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const parent = String(formData.get("parent") ?? "").trim();
    if (!name) return;

    await apiFetch(`/v1/workspaces/${workspaceId}/categories/`, {
      method: "POST",
      body: JSON.stringify({ name, parent: parent.trim() ? parent : null }),
      rawErrorBody: true,
    });

    revalidatePath("/dashboard/settings");
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return;

    await apiFetch(`/v1/workspaces/${workspaceId}/categories/${id}/`, {
      method: "DELETE",
      rawErrorBody: true,
    });

    revalidatePath("/dashboard/settings");
  }

  const firstAccountId = accounts[0]?.id ?? "";
  const accountId =
    typeof sp.accountId === "string" ? sp.accountId : firstAccountId;

  const cfg = firstAccountId
    ? await getAccountMonthConfig(workspaceId, month, accountId)
    : null;

  const accountName =
    accounts.find((a) => a.id === accountId)?.name ?? "Account";

  return (
    <main className="p-6 max-w-2xl space-y-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace and monthly account configuration.
        </p>
      </header>

      {/* ── Month Config ─────────────────────────────────────────── */}
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

      <hr className="border-stone-200 dark:border-stone-800" />

      {/* ── Accounts ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Create accounts like BPI, Cash, GCash. Each transaction belongs to
            an account.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-3 text-sm">Add account</h3>
          <form action={createAccount} className="flex gap-2">
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <Input
              name="name"
              placeholder="e.g. BPI, Cash"
              maxLength={120}
              required
            />
            <Button variant="default">Add</Button>
          </form>
        </div>

        <div>
          <h3 className="font-medium mb-3 text-sm">Your accounts</h3>
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No accounts yet.</p>
          ) : (
            <AccountsTable data={accounts} workspaceId={workspaceId} />
          )}
        </div>
      </section>

      <hr className="border-stone-200 dark:border-stone-800" />

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Create nested categories like Bills → Internet. Transactions
            reference categories.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm">Add category</h3>
          <form
            action={createCategory}
            className="grid gap-2 sm:grid-cols-[1fr_220px_120px]"
          >
            <Input
              name="name"
              placeholder="e.g. Bills, Groceries, Internet"
              maxLength={120}
              required
            />
            <Select name="parent">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="(No parent)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value=" ">(No parent)</SelectItem>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="default">Add</Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Tip: Add the parent first (e.g. Bills), then add its children
            (Internet, Electricity).
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-3 text-sm">Category tree</h3>
          {categoryRoots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <CategoryTree
              nodes={categoryRoots}
              onDeleteAction={deleteCategory}
              categoryOptions={categoryOptions}
            />
          )}
        </div>
      </section>

      <hr className="border-stone-200 dark:border-stone-800" />

      {/* ── Workspace Members ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Workspace Members</h2>
          <p className="text-sm text-muted-foreground">
            Invite others to view or edit this workspace.
          </p>
        </div>

        {/* Invite form */}
        <form action={inviteMemberAction} className="flex gap-2 flex-wrap">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <Input
            name="userId"
            placeholder="Clerk user ID (user_xxxx...)"
            className="max-w-xs"
            required
          />
          <Select name="role">
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit">Invite</Button>
        </form>
        <p className="text-xs text-muted-foreground">
          The invited user must already have an account. Ask them for their
          Clerk user ID.
        </p>

        {/* Members list */}
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.userId}
              className="flex items-center justify-between border bg-card rounded-xl px-4 py-2"
            >
              <div className="flex items-center gap-3">
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{m.name || m.userId}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.email ?? m.userId}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {m.role}
                  </p>
                </div>
              </div>
              {m.role !== "owner" && (
                <form action={removeMemberAction}>
                  <input type="hidden" name="workspaceId" value={workspaceId} />
                  <input type="hidden" name="userId" value={m.userId} />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="text-xs hover:text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
