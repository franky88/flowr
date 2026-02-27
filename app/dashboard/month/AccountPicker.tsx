"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Account = { id: string; name: string };

export function AccountPicker({
  accounts,
  defaultAccountId,
}: {
  accounts: Account[];
  defaultAccountId: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const accountId = useMemo(
    () => sp.get("accountId") ?? defaultAccountId,
    [sp, defaultAccountId],
  );

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Account</label>
      <Select
        // className="border rounded px-3 py-2"
        value={accountId}
        onValueChange={(value) => {
          const next = value;
          const params = new URLSearchParams(sp.toString());
          params.set("accountId", next);
          router.push(`/dashboard/settings?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Accounts..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
