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

export default function BudgetsPage() {
  const typeRows = [
    [
      <Code>fixed</Code>,
      "Currency amount",
      "That exact amount",
      "Internet = ₱900",
    ],
    [
      <Code>percent</Code>,
      "Percentage (0–100)",
      "% × income base",
      "Groceries = 20% → ₱13,000",
    ],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Core Concepts" current="Budgets" />
          <PageHeader
            tag="Core Concepts"
            title={
              <>
                Budget rules —{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  fixed & percent.
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
        Budgets in Flowr are rules that define how much you intend to spend in a
        category during a month. They are compared against actual transaction
        spending to produce the budget usage report.
      </ArticleP>

      <ArticleH2>Budget types</ArticleH2>
      <ComparisonTable
        headers={["Type", "Value", "Resolves to", "Example"]}
        rows={typeRows}
      />

      <ArticleH2>Fixed budgets</ArticleH2>
      <ArticleP>
        Use <Code>fixed</Code> for expenses that are the same every month
        regardless of income — subscriptions, rent, loan payments, utilities.
      </ArticleP>

      <ArticleH2>Percent budgets</ArticleH2>
      <ArticleP>
        Use <Code>percent</Code> for expenses that should scale with your income
        — groceries, entertainment, personal spending. The budget resolves
        automatically:
      </ArticleP>
      <FormulaBlock label="Percent budget resolution">
        Budget Amount <FormulaOp>=</FormulaOp> (Percent <FormulaOp>/</FormulaOp>{" "}
        100) <FormulaOp>×</FormulaOp> <FormulaResult>Income Base</FormulaResult>
      </FormulaBlock>

      <Callout variant="tip" label="Tip">
        If you change your income base mid-month, all percent budgets update
        instantly. Fixed budgets are unaffected by income base changes.
      </Callout>

      <Callout variant="info" label="Note">
        Budgets do not block spending. Going over a budget simply shows as 100%+
        in the usage view. You're always free to spend — Flowr just shows you
        where you stand.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/month-config", label: "Month Config" }}
        next={{ href: "/help/cashflow-report", label: "Cashflow Report" }}
      />
    </ArticleShell>
  );
}
