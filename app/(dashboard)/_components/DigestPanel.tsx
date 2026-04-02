"use client";

import { useEffect, useState } from "react";
import { IntelligenceReport } from "@/lib/api/intelligence";
import { Lightbulb, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  intelligence: IntelligenceReport;
  kpis: {
    income: string;
    expense: string;
    net: string;
    closingBalance: string;
  };
  previousMonth: string;
  deltaIncomePct: string | null;
  deltaExpensePct: string | null;
}

export function DigestPanel({
  intelligence,
  kpis,
  previousMonth,
  deltaIncomePct,
  deltaExpensePct,
}: Props) {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchDigest() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intelligence,
          kpis,
          previousMonth,
          deltaIncomePct,
          deltaExpensePct,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDigest(data.digest);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDigest();
  }, [intelligence.month]);

  function renderDigest(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-semibold text-primary">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        backgroundColor: "color-mix(in oklch, var(--primary) 10%, transparent)",
        border:
          "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
      }}
    >
      {/* Icon */}
      <div
        className="shrink-0 flex items-center justify-center rounded-lg w-8 h-8"
        style={{
          backgroundColor:
            "color-mix(in oklch, var(--primary) 15%, transparent)",
        }}
      >
        <Lightbulb className="w-4 h-4 text-primary" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {loading && (
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 rounded-full w-64 animate-pulse"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--primary) 20%, transparent)",
              }}
            />
            <div
              className="h-2.5 rounded-full w-40 animate-pulse"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--primary) 15%, transparent)",
              }}
            />
          </div>
        )}
        {!loading && error && (
          <p className="text-sm text-destructive">
            Failed to generate digest.{" "}
            <button
              onClick={fetchDigest}
              className="underline hover:no-underline"
            >
              Try again
            </button>
          </p>
        )}
        {!loading && digest && (
          <p className="text-sm leading-snug text-foreground">
            {renderDigest(digest)}
          </p>
        )}
      </div>

      {/* Right: refresh + CTA */}
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={fetchDigest}
          disabled={loading}
          title="Regenerate"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </button>
        <Link
          href="/dashboard/budgets"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap bg-primary text-primary-foreground"
        >
          Review Budgets
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
