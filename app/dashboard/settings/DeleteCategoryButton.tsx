"use client";
import DeleteItem from "@/components/DeleteItem";

interface Props {
  id: string;
  name: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteCategoryButton({ id, name, deleteAction }: Props) {
  function handleDelete(itemId: string) {
    const fd = new FormData();
    fd.append("id", itemId);
    deleteAction(fd);
  }

  return (
    <DeleteItem itemId={id} itemName={name} onDelete={handleDelete} />
  );
}