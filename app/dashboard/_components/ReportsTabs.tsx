"use client";

import { useState } from "react";
import BudgetVsActualTab from "./BudgetVsActualTab";
import PayPeriodTab from "./PayPeriodTab";
import DailyCashflowTab from "./DailyCashflowTab";
import MonthlyTrendTab from "./MonthlyTrendTab";

type Props = {
  month: string;
  accountId: string | null;
  workspaceId: string;
  budgetMonitor: BudgetMonitorReport;
  cashflow: CashflowReport;
  dashboard: DashboardResponse;
};

const TABS = [
  { id: "budget", label: "Budget vs Actual" },
  { id: "payperiod", label: "Pay-Period" },
  { id: "cashflow", label: "Daily Cashflow" },
  { id: "trend", label: "Monthly Trend" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ReportsTabs({
  month,
  accountId,
  workspaceId,
  budgetMonitor,
  cashflow,
  dashboard,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("budget");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-border mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "budget" && (
        <BudgetVsActualTab
          month={month}
          budgetMonitor={budgetMonitor}
          dashboard={dashboard}
        />
      )}
      {activeTab === "payperiod" && (
        <PayPeriodTab
          month={month}
          accountId={accountId}
          workspaceId={workspaceId}
        />
      )}
      {activeTab === "cashflow" && <DailyCashflowTab cashflow={cashflow} />}
      {activeTab === "trend" && (
        <MonthlyTrendTab month={month} dashboard={dashboard} />
      )}
    </div>
  );
}
