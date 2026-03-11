import { deleteTransaction } from "@/actions/transactions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import EditTransaction from "./EditTransaction";
import { CategorySelectItem } from "@/lib/categories";
import React from "react";
import { DeleteTransaction } from "./DeleteTransaction";

interface TxActionsProps {
  workspaceId: string;
  tx: Transaction;
  month: string;
  accounts: Account[];
  categoriesForSelect: CategorySelectItem[];
  canChange?: boolean;
}

const TxActions = ({
  workspaceId,
  tx,
  month,
  accounts,
  categoriesForSelect,
  canChange,
}: TxActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {/* EDIT BUTTON */}
      <EditTransaction
        workspaceId={workspaceId}
        tx={tx}
        month={month}
        accounts={accounts}
        categoriesForSelect={categoriesForSelect}
      />
      <DeleteTransaction
        id={tx.id}
        note={tx.note ?? "transaction"}
        month={month}
        workspaceId={workspaceId}
        disabled={!canChange}
      />
    </div>
  );
};

export default TxActions;
