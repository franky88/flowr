// In your budgets page header area — works as a server component
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BudgetsTabs({ active }: { active: "monthly" | "period" }) {
  const tabs = [
    { label: "Monthly", href: "/dashboard/budgets", key: "monthly" },
    { label: "Pay Period", href: "/dashboard/budgets/period", key: "period" },
  ];
  return (
    <div className="flex gap-1 border-b mb-4">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            active === t.key
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
