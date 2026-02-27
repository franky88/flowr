"use client";

import { useTransactionModal } from "@/hooks/useTransactionModal";
import { createTransactionAction } from "@/actions/transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionForm, { TransactionFormValues } from "./TransactionForm";
import { Plus } from "lucide-react";

interface AddTransactionProps {
  month: string;
  workspaceId: string;
  accounts: Account[];
  categoriesForSelect: Array<{ id: string; name: string; level: number }>;
  title?: string;
}

export default function AddTransaction({
  month,
  workspaceId,
  accounts,
  categoriesForSelect,
  title,
}: AddTransactionProps) {
  // ← swap useState for the store
  const { isOpen, open, close } = useTransactionModal();

  const disabled = accounts.length === 0 || categoriesForSelect.length === 0;

  async function handleCreate(values: TransactionFormValues) {
    const fd = new FormData();
    fd.set("workspaceId", workspaceId);
    fd.set("month", month);
    fd.set("date", values.date);
    fd.set("type", values.type === "income" ? "INCOME" : "EXPENSE");
    fd.set("amount", String(values.amount));
    fd.set("account", values.account);
    fd.set("category", values.category);
    if (values.note?.trim()) fd.set("note", values.note.trim());

    await createTransactionAction(fd);
    close(); // ← was setOpen(false)
  }

  return (
    <>
      <Button onClick={open} disabled={disabled}>
        {" "}
        {/* ← was () => setOpen(true) */}
        <Plus />
        {title}
      </Button>

      <Dialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
            <DialogDescription>Add a new transaction</DialogDescription>
          </DialogHeader>

          <TransactionForm
            mode="create"
            accounts={accounts}
            categoriesForSelect={categoriesForSelect as any}
            onSubmit={handleCreate}
            defaultValues={{ type: "expense" }}
          />

          {disabled && (
            <p className="text-xs text-muted-foreground">
              Add at least 1 account and 1 category first.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
