"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { usePlanLimit } from "@/context/PlanLimitContext";
import { ApiError } from "@/lib/errors";
import { type LimitKey } from "@/hooks/useSubscription";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCategoryForm({
  workspaceId,
  categoryOptions,
  action,
}: {
  workspaceId: string;
  categoryOptions: { id: string; name: string }[];
  action: (formData: FormData) => Promise<void>;
}) {
  const { categoriesAtLimit } = useSubscription();
  const { triggerUpgrade } = usePlanLimit();

  const handleSubmit = async (formData: FormData) => {
    if (categoriesAtLimit) {
      triggerUpgrade(
        "Your plan allows up to 10 categories. Upgrade to Pro for unlimited categories.",
        "max_categories"
      );
      return;
    }
    try {
      await action(formData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        triggerUpgrade(err.message, err.limitKey as LimitKey);
        return;
      }
      throw err;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Add category</h3>
      <form
        action={handleSubmit}
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
        <Button variant="default" type="submit">
          Add
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Tip: Add the parent first (e.g. Bills), then add its children
        (Internet, Electricity).
      </p>
    </div>
  );
}