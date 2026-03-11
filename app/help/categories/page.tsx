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

export default function CategoriesPage() {
  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Core Concepts" current="Categories" />
          <PageHeader
            tag="Core Concepts"
            title={
              <>
                Categories &{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  nesting.
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
        Categories organize your transactions and power the budget system. Every
        transaction requires a category. Categories support one level of nesting
        — a parent category can contain child categories.
      </ArticleP>

      <ArticleH2>Creating categories</ArticleH2>
      <ArticleP>
        Go to Settings → Categories. Click "Add category" and give it a name. To
        make it a child, select a parent from the dropdown. For example:
      </ArticleP>
      <ArticleUl>
        <ArticleLi>
          Food (parent) → Groceries, Dining Out, Coffee Shops
        </ArticleLi>
        <ArticleLi>Housing (parent) → Rent, Utilities</ArticleLi>
      </ArticleUl>

      <ArticleH2>How nesting affects reports</ArticleH2>
      <ArticleP>
        In budget usage and cashflow reports, parent categories show the{" "}
        <Strong>sum of all their children's spending</Strong>. Child categories
        show their own spending only.
      </ArticleP>

      <Callout variant="tip" label="Tip">
        Assign transactions to the most specific category possible (Groceries,
        not just Food). Rollups happen automatically — you get both the detail
        and the summary without double-entering anything.
      </Callout>

      <ArticleH2>Plan limits</ArticleH2>
      <ComparisonTable
        headers={["Plan", "Max categories"]}
        rows={[
          ["Free", "10"],
          ["Pro", "Unlimited"],
          ["Enterprise", "Unlimited"],
        ]}
      />

      <ArticleNav
        prev={{ href: "/help/accounts", label: "Accounts" }}
        next={{ href: "/help/month-config", label: "Month Config" }}
      />
    </ArticleShell>
  );
}
