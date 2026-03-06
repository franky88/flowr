"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetPieChart, fromDashboard } from "../budgets/BudgetPieChart";

interface Props {
  rows: DashboardBudgetRow[];
  totals: {
    spent: string;
    budgetResolved: string;
  };
}

export function DashboardBudgetPieChart({ rows, totals }: Props) {
  return (
    <Card>
        <CardHeader><CardTitle>Budget Distribution</CardTitle></CardHeader>
        <CardContent>
          <BudgetPieChart
            rows={fromDashboard(rows)}
            totalSpent={totals.spent}
            totalBudget={totals.budgetResolved}
            />
        </CardContent>
    </Card>
  );
}