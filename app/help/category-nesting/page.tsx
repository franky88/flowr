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

export default function CategoryNestingPage() {
  const rows = [
    ["Food", "None (top-level)", "Sum of Groceries + Dining Out + Coffee"],
    ["Groceries", "Food", "Own spending only"],
    ["Dining Out", "Food", "Own spending only"],
    ["Coffee Shops", "Food", "Own spending only"],
    ["Housing", "None (top-level)", "Sum of Rent + Utilities"],
    ["Rent", "Housing", "Own spending only"],
    ["Utilities", "Housing", "Own spending only"],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Categories" current="Category nesting" />
          <PageHeader
            tag="Categories"
            title={
              <>
                Category nesting and{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  rollup behavior.
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
        Flowr supports one level of category nesting — a parent category
        containing child categories. When you assign a transaction to a child
        category, it is automatically included in the parent's totals in all
        reports.
      </ArticleP>

      <ArticleH2>Example structure</ArticleH2>
      <ComparisonTable
        headers={["Category", "Parent", "Spending in reports"]}
        rows={rows}
      />

      <ArticleH2>Budgets and nesting</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          A budget on <Code>Food</Code> tracks total food spending
        </ArticleLi>
        <ArticleLi>
          A budget on <Code>Groceries</Code> tracks groceries only
        </ArticleLi>
        <ArticleLi>Having both is valid — they don't interfere</ArticleLi>
      </ArticleUl>

      <Callout variant="info" label="Note">
        There is no budget "inheritance" — setting a budget on Food does not
        automatically distribute limits across its children. Each category's
        budget is independent.
      </Callout>

      <ArticleH2>Nesting depth limit</ArticleH2>
      <ArticleP>
        Flowr supports exactly one level of nesting. You can have a parent and
        children, but you cannot create grandchildren. This keeps the data model
        simple and reports predictable.
      </ArticleP>

      <ArticleNav
        prev={{
          href: "/help/running-balance-vs-bank",
          label: "Running balance vs bank",
        }}
        next={{ href: "/help/keyboard-shortcuts", label: "Keyboard shortcuts" }}
      />
    </ArticleShell>
  );
}
