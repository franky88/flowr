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

export default function QuickStartPage() {
  const steps = [
    {
      title: "Create your first account",
      description:
        "Go to Settings → Accounts and add an account matching one of your real-world accounts (e.g. 'BDO Savings'). The name is just a label — it doesn't connect to your bank.",
    },
    {
      title: "Configure the current month",
      description: (
        <>
          In the Dashboard, select the current month and click "Configure
          month". Set your <Strong>income base</Strong> (your expected monthly
          income) and your <Strong>opening balance</Strong> (what you had at the
          start of the month).
        </>
      ),
    },
    {
      title: "Set up categories and budgets",
      description:
        "Go to Budgets and create categories for your spending (Groceries, Transport, Rent, etc.). Assign each a fixed amount or a percentage of your income base. This step is optional but unlocks the budget usage report.",
    },
    {
      title: "Log your first transactions",
      description:
        "Go to Transactions and click 'Add transaction'. Choose income or expense, enter the date, amount, account, and category. Your cashflow report and running balance update immediately.",
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Getting Started" current="Quick Start" />
          <PageHeader
            tag="Getting Started"
            title={
              <>
                Up and running in{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  10 minutes.
                </em>
              </>
            }
            metaType="guide"
            metaLabel="10 min read"
          />
        </div>
      }
    >
      <ArticleP>
        Follow these four steps to get Flowr set up and tracking your money from
        day one.
      </ArticleP>
      <Steps items={steps} />

      <ArticleH2>What you'll see right away</ArticleH2>
      <ArticleP>
        Once you have at least one transaction logged, the Dashboard will show:
      </ArticleP>
      <ArticleUl>
        <ArticleLi>Total income and expenses for the selected month</ArticleLi>
        <ArticleLi>Net cashflow (income − expenses)</ArticleLi>
        <ArticleLi>
          Running balance day-by-day (if you've set an opening balance)
        </ArticleLi>
        <ArticleLi>Budget usage per category (if you've set budgets)</ArticleLi>
      </ArticleUl>

      <Callout variant="info" label="Note">
        You can add transactions in any order — past dates, future dates, any
        sequence. Flowr always sorts and computes them correctly by date.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/overview", label: "Overview" }}
        next={{
          href: "/help/first-account",
          label: "Adding your first account",
        }}
      />
    </ArticleShell>
  );
}
