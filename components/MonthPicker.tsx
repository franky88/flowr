"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);

export function MonthPicker({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const month = sp.get("month") ?? defaultMonth;

  const [year, mon] = month.split("-").map(Number);

  function navigate(value: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("month", value);
    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  function shiftMonth(delta: number) {
    const d = new Date(year, mon - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  function setYear(y: string) {
    navigate(`${y}-${String(mon).padStart(2, "0")}`);
  }

  function setMon(m: string) {
    navigate(`${year}-${String(m).padStart(2, "0")}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Month</label>

      <button
        onClick={() => navigate(shiftMonth(-1))}
        className="px-2 py-1 text-sm rounded hover:bg-accent"
        aria-label="Previous month"
      >
        ‹
      </button>

      <Select value={String(mon)} onValueChange={setMon}>
        <SelectTrigger className="w-22.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((label, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(year)} onValueChange={setYear}>
        <SelectTrigger className="w-22.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={() => navigate(shiftMonth(+1))}
        className="px-2 py-1 text-sm rounded hover:bg-accent"
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
}