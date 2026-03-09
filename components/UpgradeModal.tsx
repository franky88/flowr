"use client";

import { usePlanLimit } from "@/context/PlanLimitContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { type LimitKey } from "@/hooks/useSubscription";

const LIMIT_META: Record<
  LimitKey,
  { label: string; description: string; icon: string }
> = {
  max_accounts: {
    label: "Account limit reached",
    description:
      "Your Free plan supports 1 account. Upgrade to Pro for unlimited accounts.",
    icon: "🏦",
  },
  max_categories: {
    label: "Category limit reached",
    description:
      "Your Free plan supports up to 10 categories. Upgrade to Pro for unlimited categories.",
    icon: "🗂️",
  },
  max_months_history: {
    label: "History limit reached",
    description:
      "Your Free plan shows only the last 3 months. Upgrade to Pro for full history access.",
    icon: "📅",
  },
  can_export: {
    label: "Export is a Pro feature",
    description:
      "Data export is not available on the Free plan. Upgrade to Pro to download your data as CSV.",
    icon: "📤",
  },
  can_use_api: {
    label: "API access is Enterprise only",
    description:
      "Programmatic API access is available on the Enterprise plan only.",
    icon: "🔌",
  },
};

const FALLBACK: (typeof LIMIT_META)[LimitKey] = {
  label: "Upgrade required",
  description: "This feature is not available on your current plan.",
  icon: "⚡",
};

export function UpgradeModal() {
  const { state, dismiss } = usePlanLimit();
  const router = useRouter();

  const meta = state.limitKey ? LIMIT_META[state.limitKey] : FALLBACK;

  const handleUpgrade = () => {
    dismiss();
    router.push("/dashboard/billing");
  };

  return (
    <Dialog open={state.open} onOpenChange={(v) => !v && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 text-3xl">{meta.icon}</div>
          <DialogTitle className="text-lg font-semibold">
            {meta.label}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {state.message || meta.description}
          </DialogDescription>
        </DialogHeader>

        {/* Plan comparison teaser */}
        <div className="rounded-lg border bg-muted/40 p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Free</span>
            <Badge variant="outline" className="text-xs">
              Current
            </Badge>
          </div>
          <ul className="space-y-1 text-muted-foreground">
            <li>✗ 1 account</li>
            <li>✗ 10 categories</li>
            <li>✗ 3 months history</li>
            <li>✗ No export</li>
          </ul>

          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-semibold text-primary">Pro</span>
            <Badge className="text-xs bg-primary">Upgrade</Badge>
          </div>
          <ul className="space-y-1">
            <li>✓ Unlimited accounts</li>
            <li>✓ Unlimited categories</li>
            <li>✓ Full history</li>
            <li>✓ CSV export</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={dismiss}>
            Not now
          </Button>
          <Button onClick={handleUpgrade}>View plans</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}