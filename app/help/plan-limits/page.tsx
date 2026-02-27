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

export default function PlanLimitsPage() {
  const rows = [
    ["Accounts", "1", "Unlimited", "Unlimited"],
    ["Categories", "10", "Unlimited", "Unlimited"],
    ["Months of history", "3", "Unlimited", "Unlimited"],
    ["Transactions per month", "Unlimited", "Unlimited", "Unlimited"],
    ["Budget rules", "Unlimited", "Unlimited", "Unlimited"],
    ["Export data", <Cross />, <Check />, <Check />],
    ["API access", <Cross />, <Cross />, <Check />],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Account & Billing" current="Plan limits" />
          <PageHeader
            tag="Account & Billing"
            title={
              <>
                Plan limits —{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  what's included.
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
        Flowr has three plans: Free, Pro, and Enterprise. Limits are enforced
        server-side — you'll always see a clear message explaining which limit
        was hit before any data is blocked or lost.
      </ArticleP>

      <ArticleH2>Plan comparison</ArticleH2>
      <ComparisonTable
        headers={["Feature", "Free", "Pro", "Enterprise"]}
        rows={rows}
      />

      <Callout variant="info" label="Note">
        The <Strong>3 months of history</Strong> limit on Free means you can
        access and create transactions within the most recent 3 months only.
        Older months are not deleted — they become visible again if you upgrade.
      </Callout>

      <ArticleH2>What happens when you hit a limit</ArticleH2>
      <ArticleP>
        When you attempt an action that would exceed your plan limit, the app
        shows an upgrade prompt identifying exactly which limit was reached.
        Your existing data is never deleted or hidden.
      </ArticleP>

      <ArticleNav
        prev={{ href: "/help/daily-balance", label: "Daily Running Balance" }}
        next={{ href: "/help/upgrade-pro", label: "Upgrade to Pro" }}
      />
    </ArticleShell>
  );
}
