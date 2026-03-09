"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { usePlanLimit } from "@/context/PlanLimitContext";
import { ApiError } from "@/lib/errors";
import { type LimitKey } from "@/hooks/useSubscription";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddAccountForm({
  workspaceId,
  action,
}: {
  workspaceId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const { accountsAtLimit } = useSubscription();
  const { triggerUpgrade } = usePlanLimit();

  const handleSubmit = async (formData: FormData) => {
    if (accountsAtLimit) {
      triggerUpgrade(
        "Your plan allows 1 account. Upgrade to Pro for unlimited accounts.",
        "max_accounts"
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
    <form action={handleSubmit} className="flex gap-2">
      <input type="hidden" name="workspaceId" value={workspaceId} />
      <Input
        name="name"
        placeholder="e.g. BPI, Cash"
        maxLength={120}
        required
      />
      <Button variant="default" type="submit">
        Add
      </Button>
    </form>
  );
}