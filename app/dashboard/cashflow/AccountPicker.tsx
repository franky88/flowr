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

type Account = { id: string; name: string };

export function AccountPicker({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const raw = sp.get("accountId"); // null means "all"
  const selectValue = raw ?? "all";

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Account</label>

      <Select
        value={selectValue}
        onValueChange={(value) => {
          const params = new URLSearchParams(sp.toString());

          if (value === "all") params.delete("accountId");
          else params.set("accountId", value);

          const qs = params.toString();
          router.push(qs ? `/dashboard/cashflow?${qs}` : "/dashboard/cashflow");
        }}
      >
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
