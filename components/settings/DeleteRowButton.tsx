"use client";
import DeleteItem from "@/components/DeleteItem";

interface Props {
  id: string;
  name: string;
  deleteAction: (formData: FormData) => Promise<void>;
  extraFields?: Record<string, string>;
}

export function DeleteRowButton({ id, name, deleteAction, extraFields }: Props) {
  function handleDelete(itemId: string) {
    const fd = new FormData();
    fd.append("id", itemId);
    for (const [key, value] of Object.entries(extraFields ?? {})) {
      fd.append(key, value);
    }
    deleteAction(fd);
  }

  return (
    <DeleteItem itemId={id} itemName={name} onDelete={handleDelete} />
  );
}