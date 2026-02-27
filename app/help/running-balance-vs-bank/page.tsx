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

export default function RunningBalanceVsBankPage() {
  const faqs = [
    {
      question: "You have transactions in your bank that aren't in Flowr yet",
      answer:
        "The most common cause. Flowr only knows about transactions you've manually entered. Review your bank statement against your Flowr transaction list and add any missing entries.",
    },
    {
      question: "Your opening balance was incorrect",
      answer: (
        <>
          If the opening balance you entered in Month Config was off — even by a
          small amount — that error carries through to every day's running
          balance. Go to{" "}
          <ArticleLink href="/help/month-config">Month Config</ArticleLink> and
          verify the opening balance matches your actual balance on the first
          day of the month.
        </>
      ),
    },
    {
      question: "Pending transactions in your bank",
      answer:
        "Banks often show pending transactions that haven't fully cleared. If you enter a transaction in Flowr on the day it happens, but your bank shows it as pending and not yet debited, there will be a temporary discrepancy. It typically resolves within 1–3 business days.",
    },
    {
      question: "Bank fees or interest charges not in Flowr",
      answer: (
        <>
          Some banks charge monthly maintenance fees, SMS alert fees, or
          interest. Create a "Bank Fees" category and log these charges when you
          see them on your statement.
        </>
      ),
    },
    {
      question: "A transaction was entered in the wrong month",
      answer:
        "If a transaction was logged with the wrong date — say, you entered February when it was a January transaction — it will appear in the wrong month's totals. Check your transaction list for dates that seem out of place and correct them.",
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb
            section="Reports"
            current="Running balance vs bank balance"
          />
          <PageHeader
            tag="Reports"
            title={
              <>
                Why your balance differs from{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  your bank.
                </em>
              </>
            }
            metaType="faq"
            metaLabel="FAQ"
          />
        </div>
      }
    >
      <ArticleP>
        If Flowr's running balance doesn't match your bank app, it's almost
        always for one of a few specific reasons.
      </ArticleP>
      <FaqList items={faqs} />

      <Callout variant="tip" label="Tip">
        A quick reconciliation habit: once a week, open your bank app and Flowr
        side-by-side. Find any transactions in your bank that aren't in Flowr
        and add them. 5 minutes a week keeps your records accurate.
      </Callout>

      <ArticleNav
        prev={{
          href: "/help/configuring-new-month",
          label: "Configuring a new month",
        }}
        next={{ href: "/help/category-nesting", label: "Category nesting" }}
      />
    </ArticleShell>
  );
}
