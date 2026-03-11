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

export default function FreeVsProPage() {
  const rows = [
    ["Accounts", "1", "Unlimited", "Unlimited"],
    ["Categories", "10", "Unlimited", "Unlimited"],
    ["Months of history", "3 months", "Unlimited", "Unlimited"],
    ["Transactions", "Unlimited", "Unlimited", "Unlimited"],
    ["Budgets", "Unlimited", "Unlimited", "Unlimited"],
    ["Cashflow reports", <Check />, <Check />, <Check />],
    ["Daily running balance", <Check />, <Check />, <Check />],
    ["CSV export", <Cross />, <Check />, <Check />],
    ["API access", <Cross />, <Cross />, <Check />],
    ["Priority support", <Cross />, <Check />, <Check />],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Plans" current="Free vs Pro comparison" />
          <PageHeader
            tag="Plans"
            title={
              <>
                Free vs Pro —{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  full comparison.
                </em>
              </>
            }
            metaType="ref"
            metaLabel="Reference"
          />
        </div>
      }
    >
      <ArticleH2>Side-by-side comparison</ArticleH2>
      <ComparisonTable
        headers={["Feature", "Free", "Pro", "Enterprise"]}
        rows={rows}
      />

      <ArticleH2>Who is Free right for?</ArticleH2>
      <ArticleP>
        Free works well if you have a single bank account, you're just getting
        started with budgeting, you don't need to look back more than 3 months,
        and you don't need to export data.
      </ArticleP>

      <ArticleH2>Who should upgrade to Pro?</ArticleH2>
      <ArticleP>
        Upgrade to Pro if you track money across multiple accounts, you've been
        using Flowr for more than 3 months, you want to export your data to
        Excel, or you need more than 10 categories.
      </ArticleP>

      <Callout variant="tip" label="Tip">
        If you're not sure, start with Free. You can upgrade at any time — your
        data is preserved and immediately unlocked. There's no migration step.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/export-data", label: "Export data" }}
        next={{ href: "/help/import-from-excel", label: "Import from Excel" }}
      />
    </ArticleShell>
  );
}
