"use client";
import { updateCategory } from "@/actions/category";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  id: string;
  currentName: string;
  currentParentId: string | null;
  categoryOptions: { id: string; name: string }[];
}

export function EditCategoryPopover({
  id,
  currentName,
  currentParentId,
  categoryOptions,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [parentId, setParentId] = useState(currentParentId ?? " ");

  async function handleSubmit(formData: FormData) {
    try {
      await updateCategory(formData);
      toast.success("Category updated.");
      setOpen(false);
    } catch {
      toast.error("Failed to update category.");
    }
  }

  const filteredOptions = categoryOptions.filter((c) => c.id !== id);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-3" align="end">
        <p className="text-sm font-medium">Edit category</p>
        <form action={handleSubmit} className="space-y-3">
          <input type="hidden" name="id" value={id} />

          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">Name</span>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">Parent</span>
            <Select name="parent" value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="(No parent)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value=" ">(No parent)</SelectItem>
                  {filteredOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
