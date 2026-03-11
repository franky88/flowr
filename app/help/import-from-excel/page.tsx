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

export default function ImportFromExcelPage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Transactions" current="Import from Excel" />
          <PageHeader
            tag="Transactions"
            title={
              <>
                Can I import from{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  Excel or a spreadsheet?
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
        CSV or Excel import is not currently supported in Flowr. All
        transactions must be entered through the app interface. This is a
        deliberate decision during the early phase of the product, not a
        technical limitation.
      </ArticleP>

      <Callout variant="info" label="On the roadmap">
        CSV import is planned. If you want it sooner, send us a message via the{" "}
        <ArticleLink href="/help">contact form</ArticleLink> — user demand
        directly influences what we build next.
      </Callout>

      <ArticleH2>Workaround: catching up quickly</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          Start from the current month — don't try to backfill years of history
        </ArticleLi>
        <ArticleLi>
          Set your opening balance to your actual current balance — this makes
          the running balance accurate without needing every historical
          transaction
        </ArticleLi>
        <ArticleLi>
          Enter only the current month's transactions going forward
        </ArticleLi>
        <ArticleLi>
          If you need older data for reference, your spreadsheet is still there
        </ArticleLi>
      </ArticleUl>

      <ArticleH2>Using the keyboard for fast entry</ArticleH2>
      <ArticleP>
        The transaction form is designed for speed. Use <Kbd>Tab</Kbd> to move
        between fields. The date field auto-fills with today's date. See the{" "}
        <ArticleLink href="/help/keyboard-shortcuts">
          Keyboard Shortcuts guide
        </ArticleLink>{" "}
        for a full list.
      </ArticleP>

      <ArticleNav
        prev={{
          href: "/help/free-vs-pro-comparison",
          label: "Free vs Pro comparison",
        }}
      />
    </ArticleShell>
  );
}
