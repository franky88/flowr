"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { copyBudgetsToNextMonth } from "@/actions/budget";
import { Copy02Icon } from "hugeicons-react";
import { formatShortMonth } from "@/lib/month";

interface Props {
  workspaceId: string;
  month: string;
}

function getNextMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function CopyBudgetsButton({ workspaceId, month }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const nextMonth = getNextMonth(month);

  async function handleCopy() {
    setLoading(true);
    try {
      const result = await copyBudgetsToNextMonth(workspaceId, month);
      toast.success(
        result.createdCount > 0
          ? `Copied ${result.createdCount} budget(s) to ${result.nextMonth}.${result.skippedCount > 0 ? ` ${result.skippedCount} skipped (already exist).` : ""}`
          : `All budgets for ${result.nextMonth} already exist — nothing to copy.`,
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleCopy} disabled={loading}>
      <Copy02Icon className="mr-2 h-4 w-4" />
      {loading ? "Copying…" : `Copy to ${formatShortMonth(nextMonth)}`}
    </Button>
  );
}
