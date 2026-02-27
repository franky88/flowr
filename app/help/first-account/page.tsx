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

export default function FirstAccountPage() {
  const steps = [
    {
      title: "Navigate to Settings → Accounts",
      description:
        "From any page, open the sidebar and click Accounts under Settings.",
    },
    {
      title: "Click 'Add account'",
      description: (
        <>
          Enter a name that matches your real account — for example:{" "}
          <Code>BDO Savings</Code>, <Code>GCash</Code>, or{" "}
          <Code>RCBC Credit</Code>. The name is a label only.
        </>
      ),
    },
    {
      title: "Save and configure the month",
      description: (
        <>
          Once the account is created, configure it for the current month by
          setting the income base and opening balance. See{" "}
          <ArticleLink href="/help/month-config">Month Config</ArticleLink> for
          details.
        </>
      ),
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb
            section="Getting Started"
            current="Adding your first account"
          />
          <PageHeader
            tag="Getting Started"
            title={
              <>
                Setting up your{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  first account.
                </em>
              </>
            }
            metaType="guide"
            metaLabel="3 min read"
          />
        </div>
      }
    >
      <ArticleP>
        An account in Flowr represents one of your real-world money buckets — a
        savings account, a digital wallet, a credit card. Each transaction is
        assigned to exactly one account, which keeps cashflow isolated and
        clear.
      </ArticleP>

      <ArticleH2>Creating an account</ArticleH2>
      <Steps items={steps} />

      <ArticleH2>How many accounts should I create?</ArticleH2>
      <ArticleP>
        Create one account per real-world account you want to track. Keeping
        them separate gives you per-account cashflow reports and opening
        balances.
      </ArticleP>

      <Callout variant="tip" label="Tip">
        Free plan users are limited to <Strong>1 account</Strong>. If you want
        to track multiple accounts (BDO + GCash + credit card), upgrade to Pro
        for unlimited accounts.
      </Callout>

      <ArticleH2>Renaming or deleting accounts</ArticleH2>
      <ArticleP>
        You can rename an account at any time — it won't affect your transaction
        history. Deleting an account will also delete all transactions and month
        configs associated with it. This is irreversible.
      </ArticleP>

      <Callout variant="warn" label="Warning">
        Deleting an account permanently deletes all its transactions. There is
        no undo. Export your data first if you need a record.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/quick-start", label: "Quick Start" }}
        next={{
          href: "/help/first-transaction",
          label: "Your first transaction",
        }}
      />
    </ArticleShell>
  );
}
