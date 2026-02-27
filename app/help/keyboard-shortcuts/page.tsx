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

export default function KeyboardShortcutsPage() {
  const globalRows = [
    [<Kbd>N</Kbd>, "Open new transaction form"],
    [
      <div>
        <Kbd>⌘ K</Kbd> / <Kbd>Ctrl K</Kbd>
      </div>,
      "Open search / command palette",
    ],
    [<Kbd>Esc</Kbd>, "Close modal or form"],
    [<Kbd>?</Kbd>, "Show keyboard shortcut reference"],
  ];

  const formRows = [
    [<Kbd>Tab</Kbd>, "Move to next field"],
    [
      <div>
        <Kbd>Shift</Kbd> <Kbd>Tab</Kbd>
      </div>,
      "Move to previous field",
    ],
    [<Kbd>I</Kbd>, "Set type to Income (when date field focused)"],
    [<Kbd>E</Kbd>, "Set type to Expense (when date field focused)"],
    [<Kbd>Enter</Kbd>, "Save transaction (from any field)"],
    [
      <div>
        <Kbd>⌘ Enter</Kbd>
      </div>,
      "Save and open a new form immediately",
    ],
  ];

  const navRows = [
    [<Kbd>←</Kbd>, "Previous month (when month picker focused)"],
    [<Kbd>→</Kbd>, "Next month (when month picker focused)"],
    [<Kbd>T</Kbd>, "Jump to current month"],
  ];

  return (
    <ArticleShell
      header={
        <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
          <Breadcrumb section="Getting Started" current="Keyboard shortcuts" />
          <PageHeader
            tag="Getting Started"
            title={
              <>
                Keyboard shortcuts &{" "}
                <em style={{ fontStyle: "italic", color: "#c8f05a" }}>
                  fast entry.
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
        Flowr is designed for fast data entry. Learning a few keyboard shortcuts
        will make logging transactions significantly quicker.
      </ArticleP>

      <ArticleH2>Global shortcuts</ArticleH2>
      <ComparisonTable headers={["Shortcut", "Action"]} rows={globalRows} />

      <ArticleH2>Transaction form shortcuts</ArticleH2>
      <ComparisonTable headers={["Shortcut", "Action"]} rows={formRows} />

      <ArticleH2>Month navigation</ArticleH2>
      <ComparisonTable headers={["Shortcut", "Action"]} rows={navRows} />

      <ArticleH2>Tips for fast bulk entry</ArticleH2>
      <ArticleUl>
        <ArticleLi>
          Use <Kbd>⌘ Enter</Kbd> to save and immediately open the next form — no
          mouse required between transactions.
        </ArticleLi>
        <ArticleLi>
          The date field remembers your last entry. If you're logging multiple
          transactions from the same day, you only need to change the date when
          it changes.
        </ArticleLi>
        <ArticleLi>
          Category dropdown supports fuzzy search — type "groc" to find
          "Groceries" without scrolling.
        </ArticleLi>
      </ArticleUl>

      <Callout variant="tip" label="Tip">
        New users often spend 10 minutes reading through the form. Experienced
        users close an entry in under 10 seconds. The difference is knowing the
        shortcuts and trusting that <Kbd>Tab</Kbd> will take you where you need
        to go.
      </Callout>

      <ArticleNav
        prev={{
          href: "/help/first-transaction",
          label: "Your first transaction",
        }}
        next={{ href: "/help/transactions", label: "Transactions" }}
      />
    </ArticleShell>
  );
}
