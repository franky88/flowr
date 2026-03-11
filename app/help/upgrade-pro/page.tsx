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

export default function UpgradeProPage() {
  const steps = [
    {
      title: "Go to Settings → Subscription",
      description:
        "You'll see your current plan, usage, and an 'Upgrade to Pro' button.",
    },
    {
      title: "Click 'Upgrade to Pro'",
      description:
        "You'll be taken to a Stripe checkout page. Your Flowr account is linked automatically — no extra steps required.",
    },
    {
      title: "Complete payment",
      description:
        "Enter your card details on the Stripe checkout page. Once payment is confirmed, your account upgrades instantly.",
    },
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Account & Billing" current="Upgrade to Pro" />
          <PageHeader
            tag="Account & Billing"
            title={
              <>
                Upgrade to{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>Pro.</em>
              </>
            }
            metaType="guide"
            metaLabel="Guide"
          />
        </div>
      }
    >
      <ArticleP>
        Upgrading to Pro unlocks unlimited accounts, unlimited categories, full
        history access, and data export. It's a monthly subscription billed via
        Stripe.
      </ArticleP>

      <ArticleH2>How to upgrade</ArticleH2>
      <Steps items={steps} />

      <ArticleH2>What changes immediately after upgrading</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          Account limit removed — add as many accounts as you need
        </ArticleLi>
        <ArticleLi>
          Category limit removed — create unlimited categories
        </ArticleLi>
        <ArticleLi>
          Full history unlocked — access all months, not just the recent 3
        </ArticleLi>
        <ArticleLi>
          Export feature enabled — download your data as CSV
        </ArticleLi>
      </ArticleUl>

      <Callout variant="info" label="Note">
        If a payment fails, your account enters a <Strong>grace period</Strong>{" "}
        until the end of the current billing period. You keep Pro access during
        this time. After the period ends, you revert to Free until payment is
        resolved.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/plan-limits", label: "Plan Limits" }}
        next={{ href: "/help/export-data", label: "Export Data" }}
      />
    </ArticleShell>
  );
}
