// app/dashboard/_components/IntelligencePanel.tsx
import { IntelligenceReport, BudgetRisk } from "@/lib/api/intelligence";
import { cn } from "@/lib/utils";

function fmt(v: string | number) {
  return `₱${Number(v).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export function IntelligencePanel({ data }: { data: IntelligenceReport }) {
  const risks = data.budgetRisks.filter((r) => r.riskLevel !== "ok");
  const forecast = Number(data.forecastBalance);
  const current = Number(data.currentBalance);
  const isDown = forecast < current;
  const dtz = data.daysUntilZero;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
        Forecast · as of {data.asOf}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Forecast Balance */}
        <div className="border bg-card rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Forecast Balance
          </p>
          <p
            className={cn(
              "text-2xl font-mono font-semibold",
              isDown ? "text-destructive" : "text-emerald-500",
            )}
          >
            {fmt(data.forecastBalance)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.daysRemaining}d remaining in month
          </p>
        </div>

        {/* Burn Rate */}
        <div
          className={cn(
            "border bg-card rounded-xl p-4 space-y-1",
            dtz !== null && dtz <= 7 && "border-destructive/60",
          )}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Burn Rate
          </p>
          <p className="text-2xl font-mono font-semibold">
            {fmt(data.dailyBurnRate)}
            <span className="text-sm font-normal text-muted-foreground">
              /day
            </span>
          </p>
          {dtz !== null ? (
            <p
              className={cn(
                "text-xs font-medium",
                dtz <= 7
                  ? "text-destructive"
                  : dtz <= 14
                    ? "text-amber-500"
                    : "text-muted-foreground",
              )}
            >
              {dtz <= 14 ? `⚠ ` : ""}
              {dtz}d before balance hits ₱0
            </p>
          ) : (
            <p className="text-xs text-emerald-500">
              Sufficient for full month
            </p>
          )}
        </div>

        {/* Budget Risks */}
        <div className="border bg-card rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Budget Risks
            </p>
            {risks.length > 0 && (
              <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                {risks.length} AT RISK
              </span>
            )}
          </div>
          {risks.length === 0 ? (
            <p className="text-xs text-emerald-500">All on track</p>
          ) : (
            <div className="space-y-1.5">
              {risks.slice(0, 3).map((r) => (
                <div key={r.categoryId} className="text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      r.riskLevel === "critical"
                        ? "text-destructive"
                        : "text-amber-500",
                    )}
                  >
                    {r.categoryName}
                  </span>
                  {Number(r.projectedOverrun) > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      · +{fmt(r.projectedOverrun)} over
                    </span>
                  )}
                </div>
              ))}
              {risks.length > 3 && (
                <p className="text-[10px] text-muted-foreground">
                  +{risks.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Income Volatility */}
        <div className="border bg-card rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Income Signal
          </p>
          <p
            className={cn("text-xl font-semibold", {
              "text-emerald-500": data.incomeVolatility.label === "stable",
              "text-amber-500": data.incomeVolatility.label === "volatile",
              "text-destructive":
                data.incomeVolatility.label === "highly_volatile",
              "text-muted-foreground":
                data.incomeVolatility.label === "insufficient_data",
            })}
          >
            {
              {
                stable: "Stable",
                volatile: "Volatile",
                highly_volatile: "High Volatility",
                insufficient_data: "Not enough data",
              }[data.incomeVolatility.label]
            }
          </p>
          <p className="text-xs text-muted-foreground">
            CV {data.incomeVolatility.cvPercent}% over 3 months
          </p>
        </div>
      </div>
    </div>
  );
}
