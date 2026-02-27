// app/dashboard/cashflow/AccountPicker.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Account = { id: string; name: string };

export function AccountPicker({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const selectValue = sp.get("accountId") ?? "all";

  function navigate(value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value === "all") params.delete("accountId");
    else params.set("accountId", value);
    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Account</label>
      <Select value={selectValue} onValueChange={navigate}>
        <SelectTrigger className="w-55">
          <SelectValue placeholder="All accounts" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All accounts</SelectItem>
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
