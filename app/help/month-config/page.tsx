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

export default function MonthConfigPage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Core Concepts" current="Month Config" />
          <PageHeader
            tag="Core Concepts"
            title={
              <>
                Month Config — anchoring{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  your cashflow.
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
        Month Config is where you set the two numbers that anchor the cashflow
        formula for each account in a given month: <Strong>income base</Strong>{" "}
        and <Strong>opening balance</Strong>. You configure this once per
        account per month.
      </ArticleP>

      <ArticleH2>Income base</ArticleH2>
      <ArticleP>
        The income base is your expected or actual gross income for the month.
        It serves two purposes:
      </ArticleP>
      <ArticleUl>
        <ArticleLi>
          It's the denominator for <Code>percent</Code>-type budgets. If your
          income base is ₱65,000 and Groceries = 20%, the budget resolves to
          ₱13,000.
        </ArticleLi>
        <ArticleLi>
          It appears in the cashflow summary as a reference figure for planned
          vs actual income.
        </ArticleLi>
      </ArticleUl>

      <Callout variant="info" label="Note">
        The income base is a <em>configuration value</em>, not a transaction. It
        does not affect your running balance directly. Only actual income
        transactions you record will move your balance.
      </Callout>

      <ArticleH2>Opening balance</ArticleH2>
      <ArticleP>
        The opening balance is what you had in this account at the start of the
        month. It's the starting point for the cashflow formula:
      </ArticleP>
      <FormulaBlock label="Running balance formula">
        Opening Balance <FormulaOp>+</FormulaOp> Income <FormulaOp>−</FormulaOp>{" "}
        Expenses <FormulaOp>=</FormulaOp>{" "}
        <FormulaResult>Running Balance</FormulaResult>
      </FormulaBlock>

      <ArticleH2>Per account, per month</ArticleH2>
      <ArticleP>
        Month Config is scoped to a specific account and a specific month. If
        you have 3 accounts, you'll have 3 separate Month Configs for February.
      </ArticleP>

      <ArticleNav
        prev={{ href: "/help/categories", label: "Categories" }}
        next={{ href: "/help/budgets", label: "Budgets" }}
      />
    </ArticleShell>
  );
}
