"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export type BudgetRuleType = "fixed" | "percent";
export type FlatCat = { id: string; name: string; level: number };

export function AddBudgetDialog({
  flatCats,
  onSubmit,
  isPending = false,
  defaultRuleType = "fixed",
  defaultAmount = "0.00",
  resetAfterSubmit = true,
  triggerLabel = "Add Budget",
  title = "Add Budget",
  description = "Create a budget rule for this month.",
}: {
  flatCats: FlatCat[];
  onSubmit: (payload: {
    categoryId: string;
    ruleType: BudgetRuleType;
    amount: string;
  }) => void | Promise<void>;
  isPending?: boolean;
  defaultRuleType?: BudgetRuleType;
  defaultAmount?: string;
  resetAfterSubmit?: boolean;

  // UI
  triggerLabel?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const [categoryId, setCategoryId] = React.useState("");
  const [ruleType, setRuleType] =
    React.useState<BudgetRuleType>(defaultRuleType);
  const [amount, setAmount] = React.useState(defaultAmount);

  const label = ruleType === "fixed" ? "Amount" : "Percent";
  const placeholder = ruleType === "fixed" ? "900.00" : "20.00";

  const disabled = isPending || !categoryId;

  const handleSubmit = async () => {
    if (!categoryId) return;
    try {
      await onSubmit({ categoryId, ruleType, amount });
      if (resetAfterSubmit) {
        setAmount(defaultAmount);
      }
      toast.success("Budget added successfully.");
    } catch (error) {
      console.error("Failed to add budget:", error);
      toast.error("Failed to add budget. Please try again.");
    } finally {
      setOpen(false);
    }
  };

  // optional: reset when closing
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && resetAfterSubmit) {
      setAmount(defaultAmount);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {flatCats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {"— ".repeat(c.level)}
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Rule</Label>
              <Select
                value={ruleType}
                onValueChange={(v) => setRuleType(v as BudgetRuleType)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Input
              className="h-9 w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={placeholder}
              inputMode="decimal"
            />
          </div>

          {isPending && (
            <div className="text-sm text-muted-foreground">Saving…</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={disabled}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
