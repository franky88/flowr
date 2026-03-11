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

export default function IncomeBasePercentBudgetsPage() {
  const rows = [
    [
      "Rent, loan payments, subscriptions",
      <>
        <Code>fixed</Code> — amount never changes
      </>,
    ],
    [
      "Groceries, dining, personal spending",
      <>
        <Code>percent</Code> — scales with income
      </>,
    ],
    [
      "Variable salary (freelance)",
      <>
        <Code>percent</Code> — adjusts automatically
      </>,
    ],
    ["Fixed salary, consistent expenses", "Either — both work well"],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb
            section="Budgets"
            current="Income base & percent budgets"
          />
          <PageHeader
            tag="Budgets"
            title={
              <>
                How income base affects{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  percent budgets.
                </em>
              </>
            }
            metaType="ref"
            metaLabel="Reference"
          />
        </div>
      }
    >
      <ArticleH2>The resolution formula</ArticleH2>
      <FormulaBlock label="Percent budget resolution">
        Budget Amount <FormulaOp>=</FormulaOp> (Percent Value{" "}
        <FormulaOp>/</FormulaOp> 100) <FormulaOp>×</FormulaOp>{" "}
        <FormulaResult>Income Base</FormulaResult>
      </FormulaBlock>
      <ArticleP>
        For example: if your income base is ₱65,000 and Groceries = 20%, then
        the Groceries budget resolves to{" "}
        <Code>(20 / 100) × 65,000 = ₱13,000</Code>.
      </ArticleP>

      <ArticleH2>When does resolution happen?</ArticleH2>
      <ArticleP>
        Resolution is computed on every page load — it is not stored. If you
        change your income base, all percent budgets update instantly everywhere
        in the app.
      </ArticleP>

      <Callout variant="warn" label="Warning">
        If you haven't set an income base for the month (or it's set to zero),
        all percent budgets will resolve to zero. Set a meaningful income base
        before relying on percent budgets.
      </Callout>

      <ArticleH2>When to use percent vs fixed</ArticleH2>
      <ComparisonTable headers={["Use case", "Recommended type"]} rows={rows} />

      <ArticleNav
        prev={{ href: "/help/budgets", label: "Budgets" }}
        next={{
          href: "/help/configuring-new-month",
          label: "Configuring a new month",
        }}
      />
    </ArticleShell>
  );
}
