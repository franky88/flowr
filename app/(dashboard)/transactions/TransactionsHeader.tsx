"use client";

import { useState } from "react";
import { MonthPicker } from "@/components/shared/MonthPicker";
import AddTransaction from "./AddTransaction";
import { ScanReceiptButton } from "./ScanReceiptButton";
import { TransactionFormValues } from "./TransactionForm";

interface Props {
  month: string;
  defaultMonth: string;
  workspaceId: string;
  accounts: Account[];
  categoriesForSelect: Array<{ id: string; name: string; level: number }>;
}

export function TransactionsHeader({
  month,
  defaultMonth,
  workspaceId,
  accounts,
  categoriesForSelect,
}: Props) {
  const [scannedDefaults, setScannedDefaults] =
    useState<Partial<TransactionFormValues> | null>(null);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MonthPicker defaultMonth={defaultMonth} />
      <ScanReceiptButton
        accounts={accounts}
        categoriesForSelect={categoriesForSelect}
        onScanned={(values) => setScannedDefaults(values)}
      />
      <AddTransaction
        month={month}
        workspaceId={workspaceId}
        accounts={accounts}
        categoriesForSelect={categoriesForSelect}
        title="Transaction"
        defaultValues={scannedDefaults ?? undefined}
        autoOpen={!!scannedDefaults}
        onClose={() => setScannedDefaults(null)}
      />
    </div>
  );
}
