"use client";

import type { ColumnDef } from "@tanstack/react-table";
import TableActions from "./TableActions";
import { DataTable } from "./data-table";
import { formatDate } from "@/lib/formatDate";

interface AccountsTableProps {
  data: Account[];
  workspaceId: string;
}

export default function AccountsTable({
  data,
  workspaceId,
}: AccountsTableProps) {
  const columns: ColumnDef<Account>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "updated_at",
      header: "Updated at",
      cell: ({ row }) => formatDate(row.original.updated_at),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TableActions accountId={row.original.id} workspaceId={workspaceId} accountName={row.original.name} />
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
