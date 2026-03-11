"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScanLine, Loader2 } from "lucide-react";
import { useReceiptScanner } from "@/hooks/useReceiptScanner";
import { TransactionFormValues } from "./TransactionForm";

interface Props {
  accounts: Account[];
  categoriesForSelect: Array<{ id: string; name: string; level: number }>;
  onScanned: (values: Partial<TransactionFormValues>) => void;
}

export function ScanReceiptButton({
  accounts,
  categoriesForSelect,
  onScanned,
}: Props) {
  const { scanning, error, trigger, handleFile, inputRef } =
    useReceiptScanner(categoriesForSelect);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          // reset so same file can be re-selected
          e.target.value = "";
          handleFile(file, (result) => {
            onScanned({
              amount: result.amount,
              date: result.date,
              type: result.type,
              note: result.note,
              category: result.categoryId ?? "",
            });
          });
        }}
      />

      <Button
        variant="outline"
        onClick={trigger}
        disabled={scanning}
        title="Scan receipt"
      >
        {scanning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ScanLine className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {scanning ? "Scanning…" : "Scan Receipt"}
        </span>
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </>
  );
}
