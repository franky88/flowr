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

export default function ExportDataPage() {
  const steps = [
    {
      title: "Go to Settings → Export",
      description:
        "The Export page is only visible on Pro and Enterprise plans.",
    },
    {
      title: "Choose your export options",
      description:
        "Select which accounts to include, and optionally filter by date range. Leave all selected to export everything.",
    },
    {
      title: "Click 'Download CSV'",
      description:
        "A CSV file downloads to your device. Open it in Excel, Google Sheets, or any spreadsheet app.",
    },
  ];

  const csvRows = [
    ["date", "YYYY-MM-DD", "2026-02-15"],
    ["type", "INCOME / EXPENSE", "EXPENSE"],
    ["amount", "Decimal", "3200.00"],
    ["account", "Text", "BDO Savings"],
    ["category", "Text", "Groceries"],
    ["note", "Text (may be empty)", "SM Supermarket"],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Account & Billing" current="Export data" />
          <PageHeader
            tag="Account & Billing"
            title={
              <>
                Exporting your{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>data.</em>
              </>
            }
            metaType="guide"
            metaLabel="Guide · Pro feature"
          />
        </div>
      }
    >
      <Callout variant="tip" label="Pro">
        Export is a <Strong>Pro plan feature</Strong>. You must be on Pro or
        Enterprise to access it.{" "}
        <ArticleLink href="/help/upgrade-pro">Upgrade here →</ArticleLink>
      </Callout>

      <ArticleH2>How to export</ArticleH2>
      <Steps items={steps} />

      <ArticleH2>CSV format</ArticleH2>
      <ComparisonTable
        headers={["Column", "Format", "Example"]}
        rows={csvRows}
      />

      <Callout variant="info" label="Note">
        The export is a snapshot at the time of download. If you add
        transactions after exporting, you'll need to export again to include
        them.
      </Callout>

      <ArticleNav
        prev={{ href: "/help/upgrade-pro", label: "Upgrade to Pro" }}
      />
    </ArticleShell>
  );
}
