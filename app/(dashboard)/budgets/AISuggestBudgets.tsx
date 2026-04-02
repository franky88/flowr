"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { bulkCreateBudgetsAction } from "@/actions/budget";
import type { SpendingRow } from "@/lib/api/reports";
import { toast } from "sonner";

interface Suggestion {
  categoryId: string;
  categoryName: string;
  rule_type: "fixed" | "percent";
  value: number;
  reasoning: string;
}

interface Props {
  workspaceId: string;
  month: string;
  incomeBase: number;
  accountId?: string;
  existingCategoryIds: string[];
}

export function AISuggestBudgets({
  workspaceId,
  month,
  incomeBase,
  accountId,
  existingCategoryIds,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applying, startApply] = useTransition();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [edited, setEdited] = useState<Record<string, Suggestion>>({});

  async function handleGenerate() {
    setLoading(true);

    try {
      const qs = new URLSearchParams({ workspaceId });
      if (accountId) qs.set("accountId", accountId);
      const historyRes = await fetch(`/api/spending-history?${qs}`);
      const history = await historyRes.json();

      const filtered = history.filter(
        (r: SpendingRow) => !existingCategoryIds.includes(r.categoryId),
      );

      if (!filtered.length) {
        toast.error("No spending history found for unconfigured categories.");
        return;
      }

      const res = await fetch("/api/suggest-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spendingHistory: filtered,
          incomeBase,
          targetMonth: month,
        }),
      });

      const data = await res.json();
      const suggs: Suggestion[] = (data.suggestions ?? []).map((s: any) => ({
        ...s,
        rule_type:
          s.rule_type?.toLowerCase() === "percent" ? "percent" : "fixed",
        value: Number(s.value) || 0,
      }));

      if (!suggs.length) {
        toast.error("AI couldn't generate suggestions. Try again.");
        return;
      }

      setSuggestions(suggs);
      const editMap: Record<string, Suggestion> = {};
      suggs.forEach((s) => {
        editMap[s.categoryId] = { ...s };
      });
      setEdited(editMap);
      setOpen(true);
    } catch {
      toast.error("Failed to generate suggestions. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyAll() {
    startApply(async () => {
      try {
        const toApply = Object.values(edited).map((s) => ({
          month,
          category: s.categoryId,
          rule_type: s.rule_type,
          value: Number(s.value).toFixed(2),
        }));

        const result = await bulkCreateBudgetsAction(workspaceId, toApply);

        toast.success(
          `${result.createdCount} budget${result.createdCount !== 1 ? "s" : ""} applied${result.skippedCount ? `, ${result.skippedCount} skipped (already exist)` : ""}.`,
        );
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Failed to apply budgets. Try again.");
      }
    });
  }

  function updateSuggestion(categoryId: string, patch: Partial<Suggestion>) {
    setEdited((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], ...patch },
    }));
  }

  function removeSuggestion(categoryId: string) {
    setEdited((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
    setSuggestions((prev) => prev.filter((s) => s.categoryId !== categoryId));
  }

  const count = Object.keys(edited).length;

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGenerate}
        disabled={loading || applying}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        {loading ? "Analyzing…" : "AI Suggest Budgets"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Budget Suggestions for {month}
            </DialogTitle>
            <DialogDescription>
              Based on your last 3 months of spending. Edit amounts before
              applying.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable rows */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border min-h-0">
            {suggestions.map((s) => {
              const current = edited[s.categoryId];
              if (!current) return null;
              return (
                <div
                  key={s.categoryId}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-3"
                >
                  {/* Category + reasoning */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s.categoryName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.reasoning}
                    </p>
                  </div>

                  {/* Rule type */}
                  <Select
                    value={current.rule_type}
                    onValueChange={(v) =>
                      updateSuggestion(s.categoryId, {
                        rule_type: v as "fixed" | "percent",
                      })
                    }
                  >
                    <SelectTrigger className="h-8 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percent">Percent</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Value */}
                  <div className="flex items-center gap-1">
                    {current.rule_type === "fixed" && (
                      <span className="text-xs text-muted-foreground">₱</span>
                    )}
                    <Input
                      type="number"
                      className="h-8 w-20 text-xs text-right"
                      value={current.value}
                      onChange={(e) =>
                        updateSuggestion(s.categoryId, {
                          value: Number(e.target.value),
                        })
                      }
                    />
                    {current.rule_type === "percent" && (
                      <span className="text-xs text-muted-foreground">%</span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeSuggestion(s.categoryId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove suggestion"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <p className="text-xs text-muted-foreground flex-1 self-center">
              {count} budget{count !== 1 ? "s" : ""} selected
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyAll}
              disabled={applying || count === 0}
              className="gap-2"
            >
              {applying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Apply {count} budget{count !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
