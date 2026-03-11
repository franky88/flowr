"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Mode = "leaf" | "rollup";

export function BudgetModeToggle({ mode }: { mode: Mode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setMode = (next: Mode) => {
    const params = new URLSearchParams(sp.toString());
    params.set("mode", next);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={mode === "leaf" ? "default" : "outline"}
        onClick={() => setMode("leaf")}
      >
        Leaf
      </Button>
      <Button
        variant={mode === "rollup" ? "default" : "outline"}
        onClick={() => setMode("rollup")}
      >
        Rollup
      </Button>
    </div>
  );
}
