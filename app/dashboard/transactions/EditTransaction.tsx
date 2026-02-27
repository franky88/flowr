"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import { CategorySelectItem } from "@/lib/categories";

import TransactionForm, { TransactionFormValues } from "./TransactionForm";
import { updateTransactionAction } from "@/actions/transactions";
import { toast } from "sonner";

export default function EditTransaction({
  workspaceId,
  tx,
  month,
  accounts,
  categoriesForSelect,
}: {
  workspaceId: string;
  tx: Transaction;
  month: string;
  accounts: Account[];
  categoriesForSelect: CategorySelectItem[];
}) {
  const [open, setOpen] = React.useState(false);

  async function onSubmit(values: TransactionFormValues) {
    try {
      await updateTransactionAction({
        workspaceId,
        id: tx.id,
        month,
        date: values.date,
        type: values.type === "income" ? "INCOME" : "EXPENSE",
        amount: Number(values.amount), // if amount is string in the form
        accountId: values.account, // map form -> action
        categoryId: values.category,
        note: values.note?.trim() ? values.note.trim() : null,
      });
      toast.success("Transaction updated successfully.");
    } catch (error) {
      console.error("Failed to update transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setOpen(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit transaction"
          className="hover:text-blue-500 h-8 w-8 p-0 text-muted-foreground"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full p-5 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit transaction</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <TransactionForm
            mode="edit"
            accounts={accounts}
            categoriesForSelect={categoriesForSelect}
            defaultValues={{
              date: tx.date,
              type: tx.type === "INCOME" ? "income" : "expense",
              amount: tx.amount,
              account: tx.account,
              category: tx.category,
              note: tx.note ?? "",
            }}
            onSubmit={onSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
