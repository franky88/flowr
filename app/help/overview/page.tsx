import { ArticleShell } from "../layout";
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

export default function OverviewPage() {
  return (
    <ArticleShell
      header={
        <>
          <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
            <Breadcrumb section="Getting Started" current="Overview" />
            <PageHeader
              tag="Getting Started"
              title={
                <>
                  Welcome to{" "}
                  <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                    Flowr.
                  </em>
                </>
              }
              metaType="guide"
              metaLabel="5 min read"
            />
          </div>
        </>
      }
    >
      <ArticleP>
        Flowr is a personal cashflow tracker built to replace the kind of Excel
        spreadsheet you've been maintaining for years. It's fast, month-scoped,
        and always computes balances live from your raw transactions.
      </ArticleP>

      <ArticleH2>The core idea</ArticleH2>
      <ArticleP>
        Most budgeting apps store your balance and update it whenever you add a
        transaction. Flowr does the opposite — it stores{" "}
        <Strong>only your transactions</Strong>, and computes everything else
        (balances, budget usage, cashflow) on demand. This means there is no
        sync risk, no drift, and no stale data.
      </ArticleP>

      <Callout variant="tip" label="Principle">
        <Strong>Transactions are the single source of truth.</Strong> Every
        number you see in Flowr — every balance, every budget remaining, every
        cashflow figure — is derived from your raw transaction records in real
        time.
      </Callout>

      <ArticleH2>Key concepts at a glance</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          <Strong>Accounts</Strong> — Your real-world accounts (BDO Savings,
          GCash, Credit Card). Each transaction belongs to one account.
        </ArticleLi>
        <ArticleLi>
          <Strong>Month Config</Strong> — Per account, per month: set your
          income base and opening balance. This anchors the cashflow formula for
          that month.
        </ArticleLi>
        <ArticleLi>
          <Strong>Transactions</Strong> — Income or expense entries. The only
          thing you need to record daily.
        </ArticleLi>
        <ArticleLi>
          <Strong>Categories</Strong> — Organize transactions. Supports nesting
          (Food → Groceries).
        </ArticleLi>
        <ArticleLi>
          <Strong>Budgets</Strong> — Fixed or percent-based rules per category
          per month. Resolved live.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>The cashflow formula</ArticleH2>
      <FormulaBlock label="Applied per account, per month">
        Opening Balance <FormulaOp>+</FormulaOp> Income <FormulaOp>−</FormulaOp>{" "}
        Expenses <FormulaOp>=</FormulaOp>{" "}
        <FormulaResult>Running Balance</FormulaResult>
      </FormulaBlock>
      <ArticleP>
        This formula runs day-by-day to produce the daily running balance view,
        and month-total to produce the cashflow summary.
      </ArticleP>

      <ArticleH2>What Flowr does not do</ArticleH2>
      <ArticleP>
        Flowr is intentionally narrow in scope. It does not do double-entry
        accounting, it does not store wallet balances, it does not auto-update
        anything. It's a cashflow tracker, not accounting software.
      </ArticleP>

      <Callout variant="warn" label="Out of scope">
        Flowr has no concept of account transfers, reconciliation, investment
        tracking, or multi-currency. If you need those things, this is not the
        right tool.
      </Callout>

      <ArticleH2>Ready to start?</ArticleH2>
      <ArticleP>
        Head to the{" "}
        <ArticleLink href="/help/quick-start">Quick Start guide</ArticleLink> to
        set up your first account, configure your first month, and log your
        first transaction in under 10 minutes.
      </ArticleP>

      <ArticleNav next={{ href: "/help/quick-start", label: "Quick Start" }} />
    </ArticleShell>
  );
}
