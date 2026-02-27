type Account = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type AccountMonthConfig = {
  id: string;
  month: string;
  account: string; // account id
  income_base: string;
  opening_balance: string;
  created_at: string;
  updated_at: string;
};

type Category = {
  id: string;
  name: string;
  parent: string | null;
  children?: Category[];
};

type Transaction = {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: "INCOME" | "EXPENSE";
  amount: string;
  account: string; // FK id
  category: string; // FK id
  note?: string | null;
  created_by?: string;
};

type UpdateTransactionInput = {
  id: string;
  month: string;
  workspaceId: string;
  date: string;
  type: "INCOME" | "EXPENSE" | "income" | "expense";
  amount: number | string;
  accountId: string;
  categoryId: string;
  note?: string | null;
};

type CashflowDay = {
  date: string;
  income: string;
  expense: string;
  net: string;
  balance: string;
};

type CashflowReport = {
  month: string;
  openingBalance: string;
  closingBalance: string;
  days: CashflowDay[];
};

type BudgetRuleType = "fixed" | "percent";

type Budget = {
  id: string;
  month: string; // "YYYY-MM"
  category: string; // category UUID
  category_name?: string; // if you included this in serializer
  rule_type: BudgetRuleType;
  value: string; // DRF often returns decimals as string
  resolved_amount?: string | null; // if you added it
  created_at: string;
  updated_at: string;
};

type BudgetUpsertInput = {
  month: string;
  category: string;
  rule_type: BudgetRuleType;
  value: string; // keep as string to avoid float issues
};

type BudgetMonitorRow = {
  categoryId: string;
  categoryName: string;
  ruleType: "fixed" | "percent";
  value: string;
  budgetResolved: string | null;
  spent: string;
  remaining: string | null;
  isExceeded: boolean;
};

type BudgetMonitorReport = {
  month: string;
  accountId: string | null;
  totals: {
    budgetResolved: string;
    spent: string;
    remaining: string;
    isExceeded: boolean;
  };
  percentSummary: {
    allocatedPercent: string;
    isOverAllocated: boolean;
    remainingPercent: string;
  };
  rows: BudgetMonitorRow[];
};

type DashboardKpis = {
  income: string;
  expense: string;
  net: string;
  openingBalance: string;
  closingBalance: string;
  incomeBase: string;
};

type KpiCompareBlock = {
  income: string;
  expense: string;
  net: string;
};

type KpiCompareDeltaBlock = {
  income: string;
  expense: string;
  net: string;
};

type KpiCompareDeltaPctBlock = {
  income: string | null; // null when previous is 0
  expense: string | null;
  net: string | null;
};

type DashboardKpisCompare = {
  previousMonth: string; // "YYYY-MM"
  previous: KpiCompareBlock; // previous month totals
  delta: KpiCompareDeltaBlock; // current - previous
  deltaPct: KpiCompareDeltaPctBlock; // percent change vs previous
};

type DashboardBudgetRow = {
  categoryId: string;
  categoryName: string;
  budgetResolved: string;
  spent: string;
  remaining: string;
  isExceeded: boolean;
};

type DashboardBudgets = {
  totals: {
    budgetResolved: string;
    spent: string;
    remaining: string;
    isExceeded: boolean;
  };
  percentSummary: {
    allocatedPercent: string;
    isOverAllocated: boolean;
    remainingPercent: string;
  };
  rows: DashboardBudgetRow[];
};

type DashboardTransaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  amount: string;
  categoryName: string;
  note?: string | null;
};

type DashboardResponse = {
  month: string;
  accountId?: string | null;
  mode: "leaf" | "rollup";
  kpis: DashboardKpis;
  kpisCompare: DashboardKpisCompare;
  budgets: DashboardBudgets;
  recentTransactions: DashboardTransaction[];
};
