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

export default function FirstTransactionPage() {
  const steps = [
    {
      title: "Go to Transactions",
      description:
        "Click 'Transactions' in the nav. Make sure the correct month is selected at the top.",
    },
    {
      title: "Click 'Add transaction'",
      description: (
        <>
          The transaction form appears. Fill in: <Strong>Type</Strong> (Income
          or Expense), <Strong>Date</Strong>, <Strong>Amount</Strong>,{" "}
          <Strong>Account</Strong>, and <Strong>Category</Strong>. The note
          field is optional.
        </>
      ),
    },
    {
      title: "Save",
      description:
        "Your transaction is saved instantly. The cashflow report and running balance update in real time — no refresh needed.",
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb
            section="Getting Started"
            current="Your first transaction"
          />
          <PageHeader
            tag="Getting Started"
            title={
              <>
                Logging your{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  first transaction.
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
        Transactions are the heartbeat of Flowr. Every balance, every report,
        every budget percentage — all of it flows from your transaction records.
      </ArticleP>

      <ArticleH2>Adding a transaction</ArticleH2>
      <Steps items={steps} />

      <ArticleH2>Income vs Expense</ArticleH2>
      <ArticleP>
        Every transaction is either <Code>INCOME</Code> or <Code>EXPENSE</Code>.
        Income adds to your running balance; expenses subtract from it.
        Transfers between your own accounts are handled by logging an expense on
        one and an income on the other with a "Transfer" category.
      </ArticleP>

      <ArticleH2>Entering amounts</ArticleH2>
      <ArticleP>
        Enter amounts as positive numbers only. The transaction type determines
        how the amount affects your balance. Do not enter negative amounts.
      </ArticleP>

      <Callout variant="info" label="Note">
        Amounts can be entered with up to <Strong>2 decimal places</Strong>. For
        example: <Code>1500.50</Code>, <Code>900.00</Code>, or <Code>3200</Code>
        .
      </Callout>

      <ArticleH2>Editing and deleting transactions</ArticleH2>
      <ArticleP>
        Click any transaction row to edit it. Changes are reflected immediately
        across all reports. Deleting a transaction is permanent — the balance
        recalculates instantly.
      </ArticleP>

      <ArticleNav
        prev={{
          href: "/help/first-account",
          label: "Adding your first account",
        }}
        next={{ href: "/help/transactions", label: "Transactions" }}
      />
    </ArticleShell>
  );
}
