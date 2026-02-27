"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBudgetAction } from "@/actions/budget";
import { AddBudgetDialog, type BudgetRuleType } from "../budgets/AddBudget";

type FlatCat = { id: string; name: string; level: number };

export function DashboardAddBudget({
  workspaceId,
  month,
  flatCats,
}: {
  workspaceId: string;
  month: string;
  flatCats: FlatCat[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [draft, setDraft] = useState<{
    categoryId: string;
    ruleType: BudgetRuleType;
    amount: string;
  }>({
    categoryId: "",
    ruleType: "fixed",
    amount: "0.00",
  });

  const onAdd = () => {
    if (!draft.categoryId) return;

    startTransition(async () => {
      await createBudgetAction(workspaceId, {
        month,
        category: draft.categoryId,
        rule_type: draft.ruleType,
        value: draft.amount,
      });

      setDraft((d) => ({ ...d, amount: "0.00" }));

      // refresh the server component data (budgets table + totals)
      router.refresh();
    });
  };

  return (
    <AddBudgetDialog
      flatCats={flatCats}
      isPending={isPending}
      onSubmit={({ categoryId, ruleType, amount }) => {
        startTransition(async () => {
          await createBudgetAction(workspaceId, {
            month,
            category: categoryId,
            rule_type: ruleType,
            value: amount,
          });
          router.refresh();
        });
      }}
    />
  );
}
