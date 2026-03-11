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

export default function CashflowReportPage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Reports" current="Cashflow Report" />
          <PageHeader
            tag="Reports"
            title={
              <>
                The cashflow{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  report.
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
        The cashflow report is the primary view in Flowr. It shows your income,
        expenses, and net cashflow for a selected month and account, all
        computed live from your transaction data.
      </ArticleP>

      <ArticleH2>What the report shows</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          <Strong>Income total</Strong> — sum of all income transactions in the
          month
        </ArticleLi>
        <ArticleLi>
          <Strong>Expense total</Strong> — sum of all expense transactions in
          the month
        </ArticleLi>
        <ArticleLi>
          <Strong>Net cashflow</Strong> — income minus expenses
        </ArticleLi>
        <ArticleLi>
          <Strong>Opening balance</Strong> — from Month Config
        </ArticleLi>
        <ArticleLi>
          <Strong>Closing balance</Strong> — opening + income − expenses
        </ArticleLi>
        <ArticleLi>
          <Strong>Category breakdown</Strong> — expenses grouped by category
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>The formula</ArticleH2>
      <FormulaBlock label="Cashflow summary">
        Opening Balance <FormulaOp>+</FormulaOp> Income <FormulaOp>−</FormulaOp>{" "}
        Expenses <FormulaOp>=</FormulaOp>{" "}
        <FormulaResult>Closing Balance</FormulaResult>
      </FormulaBlock>

      <Callout variant="warn" label="Important">
        Reports never cross month boundaries. If you need a year-to-date view,
        you would need to manually sum monthly totals — Flowr does not have a
        multi-month aggregate view.
      </Callout>

      <ArticleH2>Why is this different from my bank balance?</ArticleH2>
      <ArticleP>
        Your bank balance includes transactions you may not have recorded in
        Flowr yet. The Flowr running balance is only as accurate as the
        transactions you've entered. See{" "}
        <ArticleLink href="/help/running-balance-vs-bank">
          Running balance vs bank
        </ArticleLink>{" "}
        for details.
      </ArticleP>

      <ArticleNav
        prev={{ href: "/help/budgets", label: "Budgets" }}
        next={{ href: "/help/budget-usage", label: "Budget Usage" }}
      />
    </ArticleShell>
  );
}
