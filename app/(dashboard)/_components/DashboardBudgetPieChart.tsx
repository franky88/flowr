"use client";

import { BudgetPieChart, fromDashboard } from "./DashboardBudgetPie";

interface Props {
  rows: DashboardBudgetRow[];
  totals: {
    spent: string;
    budgetResolved: string;
  };
}

export function DashboardBudgetPieChart({ rows, totals }: Props) {
  return (
    <BudgetPieChart
      rows={fromDashboard(rows)}
      totalSpent={totals.spent}
      totalBudget={totals.budgetResolved}
    />
  );
}
