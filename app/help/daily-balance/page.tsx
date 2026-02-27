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

export default function DailyBalancePage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Reports" current="Daily Running Balance" />
          <PageHeader
            tag="Reports"
            title={
              <>
                Daily running{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  balance.
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
        The daily running balance shows exactly where your balance stands on
        each day of the month, computed incrementally from your opening balance
        through each day's transactions.
      </ArticleP>

      <ArticleH2>How it's computed</ArticleH2>
      <FormulaBlock label="Per day">
        Balance(day N) <FormulaOp>=</FormulaOp> Balance(day N-1){" "}
        <FormulaOp>+</FormulaOp> Income(N) <FormulaOp>−</FormulaOp>{" "}
        <FormulaResult>Expenses(N)</FormulaResult>
      </FormulaBlock>

      <ArticleH2>Why this matters</ArticleH2>
      <ArticleP>
        A month-end summary can look fine even if your balance dipped
        dangerously low mid-month. The daily view reveals cashflow gaps before
        they become a problem.
      </ArticleP>

      <Callout variant="tip" label="Tip">
        If your salary comes on the 15th but your bills are due the 1st–10th,
        the daily view will show the dip clearly. You can plan ahead by
        scheduling income earlier or timing expenses differently.
      </Callout>

      <Callout variant="warn" label="Warning">
        If you haven't set an opening balance for the month, the daily running
        balance will start from zero and be inaccurate. Always configure your{" "}
        <ArticleLink href="/help/month-config">Month Config</ArticleLink> before
        relying on balance figures.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/budget-usage", label: "Budget Usage" }}
        next={{ href: "/help/plan-limits", label: "Plan Limits" }}
      />
    </ArticleShell>
  );
}
