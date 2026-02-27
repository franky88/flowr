import { ArticleShell } from "@/app/help/layout";
import {
  Breadcrumb,
  PageHeader,
  ArticleH2,
  ArticleH3,
  ArticleP,
  ArticleUl,
  ArticleLi,
  ArticleLink,
  Strong,
  Callout,
  FormulaBlock,
  FormulaOp,
  FormulaResult,
  Steps,
  ComparisonTable,
  Check,
  Cross,
  FaqList,
  ArticleNav,
  Kbd,
  Code,
  Divider,
} from "@/components/help/HelpComponents";

export default function BudgetUsagePage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Reports" current="Budget Usage" />
          <PageHeader
            tag="Reports"
            title={
              <>
                Budget usage —{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  how you're tracking.
                </em>
              </>
            }
            metaType="ref"
            metaLabel="Reference"
          />
        </div>
      }
    >
      <ArticleP>
        The Budget Usage report compares your actual spending against your
        budget rules for each category in the selected month.
      </ArticleP>

      <ArticleH2>How usage is calculated</ArticleH2>
      <FormulaBlock label="Budget usage per category">
        Usage % <FormulaOp>=</FormulaOp> (Actual Spending{" "}
        <FormulaOp>/</FormulaOp> Budget Amount) <FormulaOp>×</FormulaOp>{" "}
        <FormulaResult>100</FormulaResult>
      </FormulaBlock>

      <ArticleH2>Over-budget categories</ArticleH2>
      <ArticleP>
        When actual spending exceeds the budget, usage shows as greater than
        100% and is highlighted in red. Flowr does not block spending — it only
        reports.
      </ArticleP>

      <ArticleH2>Categories without budgets</ArticleH2>
      <ArticleP>
        If a category has transactions but no budget set for the current month,
        it still appears in the report showing actual spending and "No budget"
        in the usage column.
      </ArticleP>

      <Callout variant="tip" label="Tip">
        The budget usage view is most useful mid-month — it shows you which
        categories are burning through their budget quickly so you can adjust
        spending before month-end.
      </Callout>

      <ArticleH2>Parent category rollup</ArticleH2>
      <ArticleP>
        If a parent category has child categories with transactions, the parent
        row shows the sum of all child spending. Parent and child rows are both
        visible in the report.
      </ArticleP>

      <ArticleNav
        prev={{ href: "/help/cashflow-report", label: "Cashflow Report" }}
        next={{ href: "/help/daily-balance", label: "Daily Running Balance" }}
      />
    </ArticleShell>
  );
}
