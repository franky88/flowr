"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HelpSidebar } from "@/components/help/HelpSidebar";
import { FaqList, Divider } from "@/components/help/HelpComponents";

const SEARCH_PLACEHOLDERS = [
  "e.g. how do percent budgets work?",
  "e.g. what is opening balance?",
  "e.g. can I nest categories?",
  "e.g. how to export my data?",
  "e.g. what counts as income?",
];

const TOPIC_CARDS = [
  { icon: "TX",     title: "Transactions",   href: "/help/transactions",    desc: "How to log income and expenses, edit entries, and understand how transactions power all reports.", count: 5 },
  { icon: "BUDGET", title: "Budgets",         href: "/help/budgets",         desc: "Fixed vs percent-based rules, how percent resolves against income base, and per-month budget setup.", count: 4 },
  { icon: "ACCT",   title: "Accounts",        href: "/help/accounts",        desc: "Adding accounts, setting income base and opening balance per month, and multi-account cashflow.", count: 3 },
  { icon: "CAT",    title: "Categories",      href: "/help/categories",      desc: "Creating categories, nesting subcategories, and how parent totals roll up in reports.", count: 3 },
  { icon: "REPORT", title: "Reports",         href: "/help/cashflow-report", desc: "Understanding the cashflow report, daily running balance, and budget usage view.", count: 4 },
  { icon: "PLAN",   title: "Plans & Billing", href: "/help/plan-limits",     desc: "Free vs Pro limits, upgrading your plan, and what happens when limits are reached.", count: 3 },
];

const GETTING_STARTED = [
  { type: "guide", href: "/help/first-account",       title: "Setting up your first account and month config",       meta: "5 min read" },
  { type: "guide", href: "/help/first-transaction",   title: "Adding your first transaction — income and expenses",  meta: "3 min read" },
  { type: "guide", href: "/help/budgets",             title: "Creating budget rules: fixed amounts vs percent of income", meta: "4 min read" },
  { type: "guide", href: "/help/cashflow-report",     title: "Reading the cashflow report and daily balance view",   meta: "4 min read" },
  { type: "ref",   href: "/help/keyboard-shortcuts",  title: "Keyboard shortcuts and fast data entry tips",          meta: "2 min read" },
];

const ALL_ARTICLES = [
  { type: "ref",   href: "/help/income-base-percent-budgets", title: "How income base affects percent budgets",           meta: "Budgets" },
  { type: "guide", href: "/help/configuring-new-month",       title: "Configuring a new month: step-by-step",            meta: "Accounts" },
  { type: "faq",   href: "/help/running-balance-vs-bank",     title: "Why is my running balance different from my bank balance?", meta: "Reports" },
  { type: "ref",   href: "/help/category-nesting",            title: "Category nesting and rollup behavior in reports",  meta: "Categories" },
  { type: "guide", href: "/help/export-data",                 title: "Exporting your data (Pro feature)",                meta: "Plans" },
  { type: "faq",   href: "/help/import-from-excel",           title: "Can I import data from Excel or a spreadsheet?",   meta: "Transactions" },
  { type: "ref",   href: "/help/free-vs-pro-comparison",      title: "Free vs Pro plan — full feature comparison",       meta: "Plans" },
];

const FAQ_ITEMS = [
  {
    question: "What's the difference between a fixed and percent budget?",
    answer: <>A <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#c8f05a", background: "rgba(200,240,90,0.12)", padding: "1px 5px", borderRadius: "2px" }}>fixed</code> budget locks a category to a specific currency amount each month — e.g. Internet = ₱900. A <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#c8f05a", background: "rgba(200,240,90,0.12)", padding: "1px 5px", borderRadius: "2px" }}>percent</code> budget defines spending as a fraction of your income base — e.g. Groceries = 20%, which resolves to ₱13,000 if your income base is ₱65,000. Both are evaluated live per month.</>,
  },
  {
    question: "Why do I need to set an opening balance each month?",
    answer: "Flowr is month-scoped — each month is a self-contained cashflow window. The opening balance represents what you carried in from the previous month. Without it, the formula Opening + Income − Expenses can't produce an accurate running total.",
  },
  {
    question: "Can I have multiple accounts with separate balances?",
    answer: "Yes. Each account (e.g. BDO Savings, GCash, Credit Card) has its own income base and opening balance configured per month. Transactions are tagged to a single account. Reports can show individual account cashflow or a combined view.",
  },
  {
    question: "Can categories be nested?",
    answer: "Yes. A category can have a parent, allowing structures like Food → Groceries or Food → Dining Out. In reports, parent category totals automatically roll up all child spending. Budgets can be set at any level.",
  },
  {
    question: "What happens when I hit my Free plan limits?",
    answer: "The Free plan allows 1 account, up to 10 categories, and 3 months of history. When you reach a limit, the app shows a clear upgrade prompt. Existing data is never deleted — you just can't add more until you upgrade or remove items.",
  },
  {
    question: "Are my balances stored in the database?",
    answer: "No. Flowr never stores computed balances. Every balance, budget remaining, and cashflow figure is calculated in real-time from your raw transactions. Transactions are the single source of truth.",
  },
];

const typePill = (type: string) => {
  if (type === "guide") return { color: "#c8f05a", border: "rgba(200,240,90,0.3)" };
  if (type === "faq")   return { color: "#5a9ef0", border: "rgba(90,158,240,0.3)" };
  return                        { color: "#8a8578", border: "rgba(255,255,255,0.12)" };
};

export default function HelpPage() {
  const [placeholder, setPlaceholder] = useState(SEARCH_PLACEHOLDERS[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % SEARCH_PLACEHOLDERS.length;
        setPlaceholder(SEARCH_PLACEHOLDERS[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* HERO */}
      <div
        className="relative z-10 max-w-[1200px] mx-auto px-12 flex flex-col justify-center"
        style={{ minHeight: "52vh", paddingTop: "140px", paddingBottom: "60px" }}
      >
        <div
          className="uppercase mb-5"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.14em", color: "#c8f05a", animation: "fadeUp 0.6s ease forwards 0.1s", opacity: 0 }}
        >
          Help & Documentation
        </div>

        <h1
          className="max-w-[700px] leading-none tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", letterSpacing: "-0.02em", color: "#f0ede6", animation: "fadeUp 0.7s ease forwards 0.2s", opacity: 0 }}
        >
          Everything you need to know about <em style={{ fontStyle: "italic", color: "#c8f05a" }}>Flowr.</em>
        </h1>

        <p
          className="mt-6 max-w-[440px] leading-[1.7]"
          style={{ fontSize: "1rem", color: "#8a8578", animation: "fadeUp 0.7s ease forwards 0.35s", opacity: 0 }}
        >
          Guides, references, and answers for every part of the app — from your first transaction to advanced budget rules.
        </p>

        {/* Search */}
        <div
          className="mt-10 max-w-[520px]"
          style={{ animation: "fadeUp 0.7s ease forwards 0.5s", opacity: 0 }}
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a5750", marginBottom: "8px" }}>
            Search docs
          </div>
          <div
            className="flex items-center overflow-hidden transition-all duration-200"
            style={{ background: "#141410", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px" }}
          >
            <span style={{ padding: "0 16px", color: "#5a5750", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", userSelect: "none" }}>↳</span>
            <input
              type="text"
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none py-3.5"
              style={{ color: "#f0ede6", fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", fontWeight: 300 }}
            />
            <span style={{ padding: "14px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#5a5750", borderLeft: "1px solid rgba(255,255,255,0.07)" }}>⌘ K</span>
          </div>
        </div>

        {/* Quick chips */}
        <div
          className="flex flex-wrap gap-2 mt-4 items-center"
          style={{ animation: "fadeUp 0.7s ease forwards 0.65s", opacity: 0 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5750" }}>Popular:</span>
          {[
            { label: "Cashflow formula", href: "/help/cashflow-report" },
            { label: "Budget types", href: "/help/budgets" },
            { label: "Opening balance", href: "/help/month-config" },
            { label: "Accounts", href: "/help/accounts" },
            { label: "Export data", href: "/help/export-data" },
          ].map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="no-underline uppercase transition-all duration-200 hover:opacity-80"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                color: "#8a8578",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "5px 10px",
                borderRadius: "2px",
              }}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div
        className="relative z-10 max-w-[1200px] mx-auto px-12 pb-20"
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "48px", alignItems: "start" }}
      >
        <HelpSidebar />

        <main className="min-w-0">
          {/* STATUS */}
          <div
            className="flex items-center gap-2.5 rounded mb-8 px-5 py-3.5"
            style={{ background: "#141410", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#c8f05a", boxShadow: "0 0 8px #c8f05a" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#8a8578", letterSpacing: "0.06em" }}>
              <strong style={{ color: "#f0ede6" }}>All systems operational</strong> · Last updated Feb 2026 · v1.4.0
            </span>
          </div>

          {/* TOPIC CARDS */}
          <div className="mb-16">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>Browse by topic</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "8px" }}>
              Where do you want to <em style={{ color: "#c8f05a", fontStyle: "italic" }}>start?</em>
            </h2>
            <p className="mb-8 max-w-[500px]" style={{ fontSize: "0.88rem", color: "#8a8578" }}>
              Pick a topic below or use the search to find exactly what you need.
            </p>

            <div
              className="overflow-hidden"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}
            >
              {TOPIC_CARDS.map((card, i) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="block no-underline transition-colors duration-200 hover:bg-[#1c1c17]"
                  style={{
                    background: "#141410",
                    padding: "28px 24px",
                    borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <div
                    className="inline-block uppercase mb-3.5"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      color: "#c8f05a",
                      background: "rgba(200,240,90,0.12)",
                      border: "1px solid rgba(200,240,90,0.3)",
                      padding: "4px 8px",
                      borderRadius: "2px",
                    }}
                  >
                    {card.icon}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#f0ede6", marginBottom: "8px" }}>{card.title}</div>
                  <p style={{ fontSize: "0.78rem", color: "#8a8578", lineHeight: 1.6, marginBottom: "16px" }}>{card.desc}</p>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#5a5750" }}>{card.count} articles →</div>
                </Link>
              ))}
            </div>
          </div>

          <Divider />

          {/* CASHFLOW FORMULA */}
          <div className="mb-16">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>Core Concept</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "8px" }}>
              The cashflow <em style={{ color: "#c8f05a", fontStyle: "italic" }}>formula.</em>
            </h2>
            <p className="mb-8 max-w-[500px]" style={{ fontSize: "0.88rem", color: "#8a8578" }}>Every balance in Flowr is computed from this formula. Nothing is stored.</p>

            <div className="rounded p-5 mb-5" style={{ background: "#141410", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c8f05a" }}>
              <div className="uppercase mb-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.12em", color: "#5a5750" }}>Monthly cashflow</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", color: "#f0ede6", fontWeight: 500 }}>
                Opening Balance <span style={{ color: "#8a8578", margin: "0 6px" }}>+</span> Income <span style={{ color: "#8a8578", margin: "0 6px" }}>−</span> Expenses <span style={{ color: "#8a8578", margin: "0 6px" }}>=</span> <span style={{ color: "#c8f05a" }}>Running Balance</span>
              </div>
            </div>

            <div className="flex gap-3 items-start rounded p-4 mb-4" style={{ border: "1px solid rgba(200,240,90,0.3)", background: "rgba(200,240,90,0.08)" }}>
              <span className="shrink-0 uppercase" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#c8f05a", border: "1px solid rgba(200,240,90,0.4)", padding: "3px 7px", borderRadius: "2px" }}>Tip</span>
              <p style={{ fontSize: "0.84rem", color: "#8a8578", lineHeight: 1.65 }}><strong style={{ color: "#f0ede6" }}>Balances are never stored.</strong> Flowr recomputes them live from your transactions every time you load a report. No sync step, no stale summaries.</p>
            </div>

            <div className="flex gap-3 items-start rounded p-4" style={{ border: "1px solid rgba(90,158,240,0.3)", background: "rgba(90,158,240,0.05)" }}>
              <span className="shrink-0 uppercase" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#5a9ef0", border: "1px solid rgba(90,158,240,0.4)", padding: "3px 7px", borderRadius: "2px" }}>Note</span>
              <p style={{ fontSize: "0.84rem", color: "#8a8578", lineHeight: 1.65 }}><strong style={{ color: "#f0ede6" }}>Daily running balance</strong> applies the same formula day-by-day through the month so you can see exactly where your balance stands on any given date.</p>
            </div>
          </div>

          <Divider />

          {/* GETTING STARTED */}
          <div className="mb-16">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>Getting Started</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "24px" }}>
              Start here if you're <em style={{ color: "#c8f05a", fontStyle: "italic" }}>new.</em>
            </h2>

            <div className="overflow-hidden rounded" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {GETTING_STARTED.map((article, i) => {
                const s = typePill(article.type);
                return (
                  <Link
                    key={article.href}
                    href={article.href}
                    className="flex items-center justify-between gap-4 px-6 py-4 no-underline transition-colors duration-150 hover:bg-[#1c1c17]"
                    style={{ borderBottom: i < GETTING_STARTED.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="uppercase shrink-0" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", color: s.color, border: `1px solid ${s.border}`, padding: "3px 6px", borderRadius: "2px" }}>
                        {article.type}
                      </span>
                      <span className="truncate" style={{ fontSize: "0.88rem", color: "#f0ede6" }}>{article.title}</span>
                    </div>
                    <span className="shrink-0" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#5a5750", letterSpacing: "0.06em" }}>{article.meta}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* FAQ */}
          <div className="mb-16">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>FAQ</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "8px" }}>
              Common <em style={{ color: "#c8f05a", fontStyle: "italic" }}>questions.</em>
            </h2>
            <p className="mb-8" style={{ fontSize: "0.88rem", color: "#8a8578" }}>Answers to the things people ask most.</p>
            <FaqList items={FAQ_ITEMS} />
          </div>

          <Divider />

          {/* ALL ARTICLES */}
          <div className="mb-16">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>All Articles</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "24px" }}>
              Complete <em style={{ color: "#c8f05a", fontStyle: "italic" }}>reference.</em>
            </h2>

            <div className="overflow-hidden rounded" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {ALL_ARTICLES.map((article, i) => {
                const s = typePill(article.type);
                return (
                  <Link
                    key={article.href}
                    href={article.href}
                    className="flex items-center justify-between gap-4 px-6 py-4 no-underline transition-colors duration-150 hover:bg-[#1c1c17]"
                    style={{ borderBottom: i < ALL_ARTICLES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="uppercase shrink-0" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", color: s.color, border: `1px solid ${s.border}`, padding: "3px 6px", borderRadius: "2px" }}>
                        {article.type}
                      </span>
                      <span className="truncate" style={{ fontSize: "0.88rem", color: "#f0ede6" }}>{article.title}</span>
                    </div>
                    <span className="shrink-0" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#5a5750", letterSpacing: "0.06em" }}>{article.meta}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c8f05a", marginBottom: "12px" }}>Still stuck?</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1, color: "#f0ede6", marginBottom: "24px" }}>
              We're here to <em style={{ color: "#c8f05a", fontStyle: "italic" }}>help.</em>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                {
                  tag: "Community", title: "Join the discussion",
                  desc: "Ask questions, share budgeting strategies, and connect with other Flowr users on GitHub Discussions.",
                  cta: "Open Discussions →", primary: false,
                },
                {
                  tag: "Direct support", title: "Send us a message",
                  desc: "Found a bug or have a feature request? Reach out directly. We read every message and usually respond within 24 hours.",
                  cta: "Contact Support", primary: true,
                },
              ].map((card) => (
                <div key={card.title} className="rounded p-7 transition-all duration-200 hover:bg-[#1c1c17]" style={{ background: "#141410", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a5750", marginBottom: "10px" }}>{card.tag}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0ede6", marginBottom: "8px" }}>{card.title}</div>
                  <p style={{ fontSize: "0.8rem", color: "#8a8578", lineHeight: 1.6, marginBottom: "20px" }}>{card.desc}</p>
                  <a
                    href="#"
                    className="inline-block no-underline uppercase transition-all duration-200 hover:opacity-80"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      fontWeight: card.primary ? 500 : 400,
                      background: card.primary ? "#c8f05a" : "transparent",
                      color: card.primary ? "#0c0c0a" : "#8a8578",
                      border: card.primary ? "none" : "1px solid rgba(255,255,255,0.12)",
                      padding: "10px 20px",
                      borderRadius: "4px",
                    }}
                  >
                    {card.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
