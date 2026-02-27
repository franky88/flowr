import { formatShortMonth } from "@/lib/month";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Card({
  title,
  value,
  variant = "default",
  delta,
  deltaPct,
  previousMonth,
}: {
  title: string;
  value: string;
  variant?: "income" | "expense" | "net" | "balance" | "default";
  delta?: string; // amount difference (string decimal)
  deltaPct?: string | null; // percent difference
  previousMonth?: string;
}) {
  const variantStyles = {
    income:
      "bg-emerald-50 dark:bg-emerald-950/20 border-t-3 border-emerald-950/60",
    expense: "bg-rose-50 dark:bg-rose-950/20 border-t-3 border-rose-950/60",
    net: "bg-blue-50 dark:bg-blue-950/20 border-t-3 border-blue-950/60",
    balance: "bg-amber-50 dark:bg-amber-950/20 border-t-3 border-amber-950/60",
    default: "bg-muted/50",
  };

  const valueColors = {
    income: "text-emerald-700 dark:text-emerald-400",
    expense: "text-rose-700 dark:text-rose-400",
    net: "text-blue-700 dark:text-blue-400",
    balance: "text-amber-700 dark:text-amber-400",
    default: "text-foreground",
  };

  const deltaNumber = delta ? Number(delta) : 0;
  const isPositive = deltaNumber > 0;
  const isNegative = deltaNumber < 0;

  const deltaColor = isPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : isNegative
      ? "text-rose-600 dark:text-rose-400"
      : "text-muted-foreground";

  return (
    <div
      className={`p-5 transition-colors rounded-xl ${variantStyles[variant]}`}
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <p
        className={`mt-2 text-3xl font-bold tracking-tight ${valueColors[variant]}`}
      >
        ₱{Number(value).toLocaleString()}
      </p>

      {/* Comparison Section */}
      {delta !== undefined && previousMonth && (
        <div className={`mt-2 flex items-center gap-1 text-sm ${deltaColor}`}>
          {isPositive && <ArrowUpRight className="h-4 w-4" />}
          {isNegative && <ArrowDownRight className="h-4 w-4" />}

          <span>
            {deltaNumber > 0 ? "+" : ""}₱
            {Math.abs(deltaNumber).toLocaleString()}
          </span>

          {deltaPct && (
            <span>
              ({deltaNumber > 0 ? "+" : ""}
              {deltaPct}%)
            </span>
          )}

          <span className="text-muted-foreground">
            vs {formatShortMonth(previousMonth)}
          </span>
        </div>
      )}
    </div>
  );
}
