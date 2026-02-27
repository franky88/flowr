export function toYYYYMM(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function defaultMonthYYYYMM() {
  return toYYYYMM(new Date());
}

export function formatShortMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  const shortMonth = date.toLocaleString("en-US", {
    month: "short",
  });

  const shortYear = year;

  return `${shortMonth}-${shortYear}`;
}
