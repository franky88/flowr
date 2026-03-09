"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  className?: string;
  /** compact = just the tier label, default = label + status if past_due */
  variant?: "compact" | "default";
}

export function PlanBadge({ className, variant = "default" }: PlanBadgeProps) {
  const { plan, isPro, isEnterprise, isPastDue, isLoading } = useSubscription();

  if (isLoading) return null;

  const label = isEnterprise
    ? "Enterprise"
    : isPro
    ? "Pro"
    : "Free";

  const badgeClass = isEnterprise
    ? "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800"
    : isPro
    ? "bg-primary/10 text-primary border-primary/20"
    : "bg-muted text-muted-foreground border-border";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Badge
        variant="outline"
        className={cn("text-[10px] font-semibold px-1.5 py-0", badgeClass)}
      >
        {label}
      </Badge>
      {variant === "default" && isPastDue && (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
        >
          Past due
        </Badge>
      )}
    </div>
  );
}