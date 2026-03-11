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

export default function ConfiguringNewMonthPage() {
  const steps = [
    {
      title: "Select the new month",
      description:
        "Use the month picker at the top of the Dashboard to navigate to the new month. If this is the first time, Flowr will prompt you to configure it.",
    },
    {
      title: "Set income base for each account",
      description:
        "For each account, enter your expected income for the month. For accounts with no expected income, you can leave this at 0.",
    },
    {
      title: "Set opening balance for each account",
      description:
        "Check your actual account balance on the first day of the month and enter it here. For a credit card, this might be 0 if you cleared it last month.",
    },
    {
      title: "Copy or create budget rules",
      description:
        "Budgets are month-scoped, so you'll need to set them for the new month. Use 'Copy from previous month' if your budgets are the same as last month.",
    },
    {
      title: "Start logging transactions",
      description:
        "You're ready. Head to Transactions and start recording. The cashflow report will update in real time as you add entries.",
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Accounts" current="Configuring a new month" />
          <PageHeader
            tag="Accounts"
            title={
              <>
                Configuring a new month —{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  step by step.
                </em>
              </>
            }
            metaType="guide"
            metaLabel="Guide"
          />
        </div>
      }
    >
      <ArticleP>
        At the start of each month, you need to configure each account before
        logging transactions. This takes 2–3 minutes per account and sets up the
        cashflow formula correctly.
      </ArticleP>
      <Steps items={steps} />

      <Callout variant="tip" label="Tip">
        A good habit: do your month configuration on the last day of the
        previous month. That way you're ready to log the very first transaction
        of the new month without any setup delay.
      </Callout>

      <ArticleNav
        prev={{
          href: "/help/income-base-percent-budgets",
          label: "Income base & percent budgets",
        }}
        next={{
          href: "/help/running-balance-vs-bank",
          label: "Running balance vs bank",
        }}
      />
    </ArticleShell>
  );
}
