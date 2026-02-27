"use client";

import { BudgetPieChart, fromBudgetMonitor } from "./BudgetPieChart";

interface PieChartPageProps {
  data: BudgetMonitorReport;
}

const PieChartPage = ({ data }: PieChartPageProps) => {
  return (
    <BudgetPieChart
      rows={fromBudgetMonitor(data.rows)}
      totalSpent={data.totals.spent}
      totalBudget={data.totals.budgetResolved}
    />
  );
};

export default PieChartPage;
