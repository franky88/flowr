"use client";
import { deleteAccount } from "@/actions/accounts";
import { DeleteRowButton } from "@/components/settings/DeleteRowButton";

interface TableActionsProps {
  accountId: string;
  accountName: string;
  workspaceId: string;
}

const TableActions = ({
  accountId,
  accountName,
  workspaceId,
}: TableActionsProps) => {
  return (
    <div className="flex items-center justify-end">
      <DeleteRowButton
        id={accountId}
        name={accountName}
        deleteAction={deleteAccount}
        extraFields={{ workspaceId }}
      />
    </div>
  );
};

export default TableActions;
