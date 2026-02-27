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

export default function TransactionsPage() {
  const tableHeaders = ["Field", "Type", "Description"];
  const tableRows = [
    [
      "Date",
      <Code>YYYY-MM-DD</Code>,
      "The date the transaction occurred. Used for daily running balance calculation.",
    ],
    [
      "Type",
      <div>
        <Code>INCOME</Code> or <Code>EXPENSE</Code>
      </div>,
      "Determines whether the amount is added or subtracted from your balance.",
    ],
    [
      "Amount",
      "Positive decimal",
      "The transaction value. Always positive — type determines the sign.",
    ],
    [
      "Account",
      "FK → Account",
      "Which account this transaction belongs to. Required.",
    ],
    [
      "Category",
      "FK → Category",
      "For grouping and budget tracking. Required.",
    ],
    [
      "Note",
      "Text (optional)",
      "Free-text description for your own reference. Not used in any calculation.",
    ],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Core Concepts" current="Transactions" />
          <PageHeader
            tag="Core Concepts"
            title={
              <>
                Transactions — the{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  source of truth.
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
        In Flowr, transactions are the only data you actively record. Everything
        else — balances, reports, budget percentages — is computed from them on
        demand.
      </ArticleP>

      <ArticleH2>Transaction fields</ArticleH2>
      <ComparisonTable headers={tableHeaders} rows={tableRows} />

      <ArticleH2>Month scoping</ArticleH2>
      <ArticleP>
        Transactions are always viewed within a selected month. A transaction
        dated <Code>2026-02-15</Code> will only appear when February 2026 is
        selected.
      </ArticleP>

      <Callout variant="warn" label="Important">
        Transactions cannot span months. If you have a recurring payment that
        crosses month boundaries, record it as separate transactions in each
        month it affects your cashflow.
      </Callout>

      <ArticleH2>How transactions affect balances</ArticleH2>
      <FormulaBlock label="Per month, per account">
        Opening Balance <FormulaOp>+</FormulaOp> Σ Income{" "}
        <FormulaOp>−</FormulaOp> Σ Expenses <FormulaOp>=</FormulaOp>{" "}
        <FormulaResult>Closing Balance</FormulaResult>
      </FormulaBlock>

      <Callout variant="tip" label="Tip">
        There is no "correct order" to enter transactions. Enter them in
        whatever order is convenient — Flowr always sorts by date when computing
        balances and rendering reports.
      </Callout>

      <ArticleNav
        prev={{
          href: "/help/first-transaction",
          label: "Your first transaction",
        }}
        next={{ href: "/help/accounts", label: "Accounts" }}
      />
    </ArticleShell>
  );
}
