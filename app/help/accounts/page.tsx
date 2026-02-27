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

export default function AccountsPage() {
  const planRows = [
    ["Free", "1"],
    ["Pro", "Unlimited"],
    ["Enterprise", "Unlimited"],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Core Concepts" current="Accounts" />
          <PageHeader
            tag="Core Concepts"
            title={
              <>
                Accounts — your money{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  buckets.
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
        Accounts represent the real-world places your money lives — a savings
        account, a digital wallet, a credit card. In Flowr, accounts are simple
        containers: they have a name, and transactions are assigned to them.
      </ArticleP>

      <ArticleH2>What accounts do</ArticleH2>
      <ArticleUl>
        <ArticleLi>Each transaction belongs to exactly one account.</ArticleLi>
        <ArticleLi>
          Reports can be filtered by account or shown across all accounts
          combined.
        </ArticleLi>
        <ArticleLi>
          Each account has its own income base and opening balance, configured
          per month via{" "}
          <ArticleLink href="/help/month-config">Month Config</ArticleLink>.
        </ArticleLi>
        <ArticleLi>
          Running balances are calculated per account, not globally.
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>What accounts don't do</ArticleH2>
      <ArticleP>
        Accounts in Flowr are not connected to your real bank. There is no
        import, no sync, no plaid integration. You record transactions manually
        — manual entry gives you clarity and control that automatic sync rarely
        provides.
      </ArticleP>

      <Callout variant="info" label="Note">
        Flowr accounts are labels, not live connections. The balance you see is
        calculated from the transactions you've entered — it will match your
        real bank only as accurately as your records are complete.
      </Callout>

      <ArticleH2>Plan limits</ArticleH2>
      <ComparisonTable headers={["Plan", "Max accounts"]} rows={planRows} />

      <ArticleNav
        prev={{ href: "/help/transactions", label: "Transactions" }}
        next={{ href: "/help/categories", label: "Categories" }}
      />
    </ArticleShell>
  );
}
