import { CategoryNode, uniqueById } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { listCategories } from "@/lib/api/category";
import { getWorkspaceId } from "@/lib/api/workspace";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

function CategoryTree({
  nodes,
  onDeleteAction,
}: {
  nodes: CategoryNode[];
  onDeleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center justify-between py-2 px-4 border">
            <span className="font-medium">{n.name}</span>

            <form action={onDeleteAction}>
              <input type="hidden" name="id" value={n.id} />
              <Button
                variant={"ghost"}
                className="hover:text-red-500 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {(n.children?.length ?? 0) > 0 && (
            <div className="mt-3 pl-4 border-l-5">
              <CategoryTree
                nodes={n.children!}
                onDeleteAction={onDeleteAction}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function CategoriesPage() {
  const workspaceId = await getWorkspaceId();
  const all = await listCategories(workspaceId);
  const roots = all.filter((c) => c.parent === null);
  const options = uniqueById(all).sort((a, b) => a.name.localeCompare(b.name));

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

    revalidatePath("/dashboard/categories");
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return;

    await apiFetch(`/v1/workspaces/${workspaceId}/categories/${id}/`, {
      method: "DELETE",
      rawErrorBody: true,
    });

    revalidatePath("/dashboard/categories");
  }

  return (
    <main className="p-6 max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Create nested categories like Bills → Internet. Transactions reference
          categories.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-medium">Add category</h2>

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
                {options.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant={"default"}>Add</Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Tip: Add the parent first (e.g. Bills), then add its children
          (Internet, Electricity).
        </p>
      </section>

      <section>
        <h2 className="font-medium mb-3">Category tree</h2>

        {roots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <CategoryTree nodes={roots} onDeleteAction={deleteCategory} />
        )}
      </section>
    </main>
  );
}
