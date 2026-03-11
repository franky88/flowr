import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteItemProps {
  itemId: string;
  itemName: string;
  onDelete: (itemId: string) => void;
  disabled?: boolean;
}

const DeleteItem = ({
  itemId,
  itemName,
  onDelete,
  disabled,
}: DeleteItemProps) => {
  const handleDelete = () => {
    try {
      onDelete(itemId);
      toast.success(`${itemName} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`Failed to delete ${itemName}. Please try again.`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-red-500 hover:bg-red-100 h-8 w-8 p-0 text-muted-foreground"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <strong>{itemName}</strong> and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            onClick={() => handleDelete()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteItem;
