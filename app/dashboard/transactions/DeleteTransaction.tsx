"use client";

import { deleteTransaction } from "@/actions/transactions";
import DeleteItem from "@/components/DeleteItem";

interface Props {
  id: string;
  note?: string;
  month: string;
  workspaceId: string;
  disabled?: boolean;
}

export function DeleteTransaction({
  id,
  note,
  month,
  workspaceId,
  disabled,
}: Props) {
  async function handleDelete(itemId: string) {
    const fd = new FormData();
    fd.set("id", itemId);
    fd.set("month", month);
    fd.set("workspaceId", workspaceId);
    await deleteTransaction(fd);
  }

  return (
    <DeleteItem
      itemId={id}
      itemName={note ?? "transaction"}
      onDelete={handleDelete}
      disabled={disabled}
    />
  );
}
