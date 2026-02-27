"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/*
        Scoped styles that reference only your globals.css variables.
        No hardcoded colours — everything comes from --background,
        --foreground, --primary, --muted-foreground, --border, etc.
      */}
      <style>{`
        /* ── fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── page-level aliases (read from your globals.css theme vars) ── */
        .lp {
          --lp-bg:          var(--background);
          --lp-surface:     var(--card);
          --lp-surface2:    var(--popover);
          --lp-fg:          var(--foreground);
          --lp-muted:       var(--muted-foreground);
          --lp-dim:         color-mix(in oklch, var(--muted-foreground) 60%, transparent);
          --lp-border:      var(--border);
          --lp-border-lt:   var(--input);
          --lp-accent:      var(--primary);
          --lp-accent-dim:  color-mix(in oklch, var(--primary) 12%, transparent);
          --lp-accent-bdr:  color-mix(in oklch, var(--primary) 30%, transparent);
          --lp-red:         var(--destructive);
          --lp-red-dim:     color-mix(in oklch, var(--destructive) 10%, transparent);
          --lp-mono:        'DM Mono', monospace;
          --lp-display:     'Playfair Display', serif;
          --lp-sans:        'DM Sans', var(--font-sans), sans-serif;
          --lp-radius:      var(--radius);

          background: var(--lp-bg);
          color: var(--lp-fg);
          font-family: var(--lp-sans);
          font-weight: 300;
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        /* subtle grid bg overlay */
        .lp::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(color-mix(in oklch, var(--lp-fg) 3%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklch, var(--lp-fg) 3%, transparent) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAV ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          background: color-mix(in oklch, var(--lp-bg) 85%, transparent);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--lp-border);
        }
        .lp-logo {
          font-family: var(--lp-display);
          font-size: 1.4rem; font-style: italic;
          color: var(--lp-fg); letter-spacing: -0.01em;
        }
        .lp-logo span { color: var(--lp-accent); font-style: normal; }
        .lp-nav-links { display: flex; gap: 32px; list-style: none; }
        .lp-nav-links a {
          font-family: var(--lp-mono); font-size: 0.72rem;
          color: var(--lp-muted); text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .lp-nav-links a:hover { color: var(--lp-fg); }

        /* ── BUTTONS ── */
        .btn-cta {
          font-family: var(--lp-mono); font-size: 0.72rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: var(--lp-accent); color: var(--primary-foreground);
          border: none; padding: 10px 20px;
          border-radius: var(--lp-radius);
          cursor: pointer; font-weight: 500;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-primary {
          font-family: var(--lp-mono); font-size: 0.78rem;
          letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500;
          background: var(--lp-accent); color: var(--primary-foreground);
          border: none; padding: 14px 28px;
          border-radius: var(--lp-radius);
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover { opacity: 0.85; transform: translateY(-2px); }

        .btn-ghost {
          font-family: var(--lp-mono); font-size: 0.78rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: transparent; color: var(--lp-muted);
          border: 1px solid var(--lp-border-lt);
          padding: 14px 28px; border-radius: var(--lp-radius);
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: var(--lp-muted); color: var(--lp-fg); }

        /* ── HERO ── */
        .lp-hero {
          position: relative; z-index: 1;
          min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
          padding: 140px 48px 80px; max-width: 1200px; margin: 0 auto;
        }
        .hero-tag {
          font-family: var(--lp-mono); font-size: 0.68rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--lp-accent); margin-bottom: 24px;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s;
        }
        .hero-title {
          font-family: var(--lp-display);
          font-size: clamp(3.5rem, 7vw, 7rem);
          line-height: 1.0; letter-spacing: -0.02em;
          color: var(--lp-fg); max-width: 820px;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.2s;
        }
        .hero-title em { font-style: italic; color: var(--lp-accent); }
        .hero-sub {
          margin-top: 28px; font-size: 1.05rem;
          color: var(--lp-muted); max-width: 480px; line-height: 1.7;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.35s;
        }
        .hero-actions {
          display: flex; gap: 16px; margin-top: 44px;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.5s;
        }
        .hero-stats {
          display: flex; gap: 0; margin-top: 72px;
          border: 1px solid var(--lp-border); border-radius: var(--lp-radius);
          overflow: hidden;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.65s;
        }
        .stat { flex: 1; padding: 20px 28px; border-right: 1px solid var(--lp-border); }
        .stat:last-child { border-right: none; }
        .stat-label {
          font-family: var(--lp-mono); font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--lp-dim); margin-bottom: 6px;
        }
        .stat-value { font-family: var(--lp-mono); font-size: 1.3rem; font-weight: 500; }
        .stat-value.green   { color: var(--lp-accent); }
        .stat-value.red     { color: var(--lp-red); }
        .stat-value.neutral { color: var(--lp-fg); }
        .stat-delta { font-family: var(--lp-mono); font-size: 0.65rem; color: var(--lp-dim); margin-top: 2px; }

        /* ── FORMULA BAND ── */
        .formula-band {
          position: relative; z-index: 1;
          background: var(--lp-surface);
          border-top: 1px solid var(--lp-border); border-bottom: 1px solid var(--lp-border);
          padding: 28px 48px; overflow: hidden;
        }
        .formula-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .formula-label {
          font-family: var(--lp-mono); font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--lp-dim); margin-right: 8px;
        }
        .formula-part { font-family: var(--lp-mono); font-size: 1rem; color: var(--lp-muted); }
        .formula-part.hi     { color: var(--lp-fg); font-weight: 500; }
        .formula-part.accent { color: var(--lp-accent); font-weight: 500; }
        .formula-part.debit  { color: var(--lp-red); font-weight: 500; }
        .formula-op { font-family: var(--lp-mono); font-size: 1rem; color: var(--lp-dim); padding: 0 4px; }

        /* ── SECTIONS ── */
        .lp-section {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 96px 48px;
        }
        .section-header { margin-bottom: 60px; }
        .section-tag {
          font-family: var(--lp-mono); font-size: 0.62rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--lp-accent); margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--lp-display);
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.1; letter-spacing: -0.02em; max-width: 600px;
        }
        .section-title em { font-style: italic; color: var(--lp-muted); }

        /* ── FEATURES ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--lp-border);
          border: 1px solid var(--lp-border); border-radius: var(--lp-radius); overflow: hidden;
        }
        .feature-card { background: var(--lp-surface); padding: 36px 32px; transition: background 0.2s; }
        .feature-card:hover { background: var(--lp-surface2); }
        .feature-icon {
          font-family: var(--lp-mono); font-size: 0.68rem; letter-spacing: 0.1em;
          color: var(--lp-accent); background: var(--lp-accent-dim);
          border: 1px solid var(--lp-accent-bdr);
          display: inline-block; padding: 4px 10px; border-radius: 2px; margin-bottom: 20px;
        }
        .feature-title { font-family: var(--lp-display); font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; line-height: 1.2; }
        .feature-desc  { font-size: 0.88rem; color: var(--lp-muted); line-height: 1.65; }

        /* ── PREVIEW TABLE ── */
        .preview-section {
          position: relative; z-index: 1;
          background: var(--lp-surface);
          border-top: 1px solid var(--lp-border); border-bottom: 1px solid var(--lp-border);
          padding: 80px 0; overflow: hidden;
        }
        .preview-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .mock-table {
          margin-top: 48px; border: 1px solid var(--lp-border);
          border-radius: var(--lp-radius); overflow: hidden;
          font-family: var(--lp-mono); font-size: 0.78rem;
        }
        .mock-header {
          display: grid; grid-template-columns: 100px 1fr 130px 130px 130px;
          background: var(--lp-surface2); border-bottom: 1px solid var(--lp-border);
        }
        .mock-th {
          padding: 12px 16px; font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--lp-dim);
          border-right: 1px solid var(--lp-border);
        }
        .mock-th:last-child { border-right: none; }
        .mock-row {
          display: grid; grid-template-columns: 100px 1fr 130px 130px 130px;
          border-bottom: 1px solid var(--lp-border); transition: background 0.15s;
        }
        .mock-row:last-child { border-bottom: none; }
        .mock-row:hover { background: color-mix(in oklch, var(--lp-fg) 2%, transparent); }
        .mock-td {
          padding: 13px 16px; color: var(--lp-muted);
          border-right: 1px solid var(--lp-border); white-space: nowrap;
        }
        .mock-td:last-child { border-right: none; }
        .mock-td.date    { color: var(--lp-dim); font-size: 0.72rem; }
        .mock-td.desc    { color: var(--lp-fg); }
        .mock-td.income  { color: var(--lp-accent); }
        .mock-td.expense { color: var(--lp-red); }
        .mock-td.balance { color: var(--lp-fg); font-weight: 500; }
        .mock-td.cat-cell { display: flex; align-items: center; }
        .cat-chip {
          background: var(--lp-accent-dim); border: 1px solid var(--lp-accent-bdr);
          color: var(--lp-accent); padding: 2px 8px; border-radius: 2px;
          font-size: 0.62rem; letter-spacing: 0.06em;
        }
        .cat-chip.red {
          background: var(--lp-red-dim);
          border-color: color-mix(in oklch, var(--lp-red) 25%, transparent);
          color: var(--lp-red);
        }

        /* ── BUDGET ── */
        .budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 48px; }
        .budget-card {
          border: 1px solid var(--lp-border); border-radius: var(--lp-radius);
          padding: 24px 28px; background: var(--lp-surface);
        }
        .budget-card-title {
          font-family: var(--lp-mono); font-size: 0.6rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--lp-dim); margin-bottom: 20px;
        }
        .budget-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid var(--lp-border); gap: 16px;
        }
        .budget-row:last-child { border-bottom: none; padding-bottom: 0; }
        .budget-cat { font-family: var(--lp-mono); font-size: 0.75rem; color: var(--lp-muted); flex: 1; }
        .budget-bar-wrap {
          flex: 2; height: 4px;
          background: color-mix(in oklch, var(--lp-fg) 6%, transparent);
          border-radius: 2px; overflow: hidden;
        }
        .budget-bar { height: 100%; border-radius: 2px; background: var(--lp-accent); transition: width 1s ease; }
        .budget-bar.over { background: var(--lp-red); }
        .budget-pct { font-family: var(--lp-mono); font-size: 0.68rem; color: var(--lp-dim); width: 36px; text-align: right; }
        .budget-pct.over { color: var(--lp-red); }

        /* ── HOW IT WORKS ── */
        .steps {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--lp-border);
          border: 1px solid var(--lp-border); border-radius: var(--lp-radius);
          overflow: hidden; margin-top: 48px;
        }
        .step { background: var(--lp-surface); padding: 32px 28px; }
        .step-num   { font-family: var(--lp-mono); font-size: 0.6rem; letter-spacing: 0.12em; color: var(--lp-dim); margin-bottom: 16px; }
        .step-title { font-family: var(--lp-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .step-desc  { font-size: 0.83rem; color: var(--lp-muted); line-height: 1.6; }

        /* ── CTA ── */
        .cta-section {
          position: relative; z-index: 1; text-align: center;
          padding: 100px 48px; max-width: 1200px; margin: 0 auto;
        }
        .cta-section .section-title { max-width: 100%; text-align: center; }
        .cta-sub { margin-top: 20px; color: var(--lp-muted); font-size: 1rem; text-align: center; }
        .cta-actions { display: flex; gap: 16px; justify-content: center; margin-top: 40px; }
        .cta-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse at center, var(--lp-accent-dim) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── FOOTER ── */
        .lp-footer {
          position: relative; z-index: 1;
          border-top: 1px solid var(--lp-border);
          padding: 32px 48px; display: flex; align-items: center; justify-content: space-between;
        }
        .footer-logo { font-family: var(--lp-display); font-style: italic; font-size: 1.1rem; color: var(--lp-dim); }
        .footer-copy { font-family: var(--lp-mono); font-size: 0.62rem; letter-spacing: 0.08em; color: var(--lp-dim); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .lp-nav { padding: 16px 24px; }
          .lp-nav-links { display: none; }
          .lp-hero { padding: 120px 24px 60px; }
          .lp-section { padding: 64px 24px; }
          .features-grid { grid-template-columns: 1fr; }
          .mock-header, .mock-row { grid-template-columns: 80px 1fr 100px 100px; }
          .mock-td:nth-child(4), .mock-th:nth-child(4) { display: none; }
          .budget-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr 1fr; }
          .lp-footer { flex-direction: column; gap: 12px; text-align: center; }
          .formula-band { padding: 20px 24px; }
          .preview-inner { padding: 0 24px; }
          .cta-section { padding: 64px 24px; }
        }
      `}</style>

      <div className="lp">
        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
            Flowr<span>.</span>
          </div>
          <ul className="lp-nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#preview">Preview</a>
            </li>
            <li>
              <a href="#how">How it works</a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ThemeToggle />
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-cta">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="btn-cta">Dashboard</button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="hero-tag">
            Personal Cashflow Tracker — Account-Scoped, Transaction-First
          </div>
          <h1 className="hero-title">
            Replace your
            <br />
            spreadsheet with
            <br />
            <em>something smarter.</em>
          </h1>
          <p className="hero-sub">
            Flowr is a precision cashflow system built for people who manage
            money like engineers. Transactions are truth. Everything else is
            computed.
          </p>
          <div className="hero-actions">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary">Start Tracking Free</button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn-ghost">Sign In →</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="btn-primary">Go to Dashboard</button>
              </Link>
              <Link href="/transactions">
                <button className="btn-ghost">View Transactions →</button>
              </Link>
            </SignedIn>
          </div>

          <div className="hero-stats">
            {[
              {
                label: "Opening Balance",
                value: "₱ 42,500.00",
                tone: "neutral",
                delta: "Feb 2026",
              },
              {
                label: "Total Income",
                value: "+ ₱ 65,000.00",
                tone: "green",
                delta: "3 transactions",
              },
              {
                label: "Total Expenses",
                value: "− ₱ 38,240.00",
                tone: "red",
                delta: "14 transactions",
              },
              {
                label: "Net Balance",
                value: "₱ 69,260.00",
                tone: "green",
                delta: "↑ Surplus month",
              },
            ].map((s) => (
              <div key={s.label} className="stat">
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.tone}`}>{s.value}</div>
                <div className="stat-delta">{s.delta}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FORMULA BAND ── */}
        <div className="formula-band">
          <div className="formula-inner">
            <span className="formula-label">Core Formula</span>
            <span className="formula-part hi">Opening Balance</span>
            <span className="formula-op">+</span>
            <span className="formula-part accent">Income</span>
            <span className="formula-op">−</span>
            <span className="formula-part debit">Expenses</span>
            <span className="formula-op">=</span>
            <span className="formula-part hi">Running Balance</span>
            <span className="formula-op" style={{ marginLeft: "auto" }}>
              ·
            </span>
            <span
              className="formula-part"
              style={{ fontSize: "0.72rem", color: "var(--lp-dim)" }}
            >
              Computed daily. Never stored.
            </span>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="lp-section" id="features">
          <div className="section-header reveal">
            <div className="section-tag">Core Features</div>
            <h2 className="section-title">
              Built on one
              <br />
              <em>principle</em>: truth from transactions.
            </h2>
          </div>
          <div className="features-grid reveal">
            {[
              {
                icon: "TX",
                title: "Transactions First",
                desc: "Every balance, report, and budget is computed from raw transactions. No stored aggregates. No sync issues. One source of truth.",
              },
              {
                icon: "MONTH",
                title: "Month-Scoped by Design",
                desc: "Budgets and reports never cross month boundaries. Each month is isolated and independently configurable — per account, not globally.",
              },
              {
                icon: "BUDGET",
                title: "Smart Budget Rules",
                desc: "Define budgets as fixed amounts (Internet = ₱900) or as a percentage of each account's income base (Groceries = 20%). Both resolve to live values per account.",
              },
              {
                icon: "ACCT",
                title: "Account-Level Config",
                desc: "Income base and opening balance are configured per account, per month. Each account has its own cashflow context — no global overrides.",
              },
              {
                icon: "CAT",
                title: "Nested Categories",
                desc: "Organize spending with nested categories. Parent categories roll up child totals automatically across all reports and budget views.",
              },
              {
                icon: "DAILY",
                title: "Daily Running Balance",
                desc: "See exactly where your balance stands day-by-day throughout the month. Cashflow gaps are visible before they become problems.",
              },
            ].map((f) => (
              <div key={f.icon} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PREVIEW ── */}
        <div className="preview-section" id="preview">
          <div className="preview-inner">
            <div className="section-header reveal">
              <div className="section-tag">Interface Preview</div>
              <h2 className="section-title">
                Tables first.
                <br />
                <em>Charts second.</em>
              </h2>
            </div>

            <div className="mock-table reveal">
              <div className="mock-header">
                {["Date", "Description", "Account", "Amount", "Balance"].map(
                  (h) => (
                    <div key={h} className="mock-th">
                      {h}
                    </div>
                  ),
                )}
              </div>
              {[
                {
                  date: "Feb 01",
                  desc: "Monthly Salary",
                  acct: "BDO Savings",
                  red: false,
                  amt: "+ 65,000.00",
                  income: true,
                  bal: "107,500.00",
                },
                {
                  date: "Feb 03",
                  desc: "Meralco Electric",
                  acct: "GCash",
                  red: true,
                  amt: "− 3,200.00",
                  income: false,
                  bal: "104,300.00",
                },
                {
                  date: "Feb 05",
                  desc: "SM Supermarket",
                  acct: "BDO Savings",
                  red: true,
                  amt: "− 5,840.00",
                  income: false,
                  bal: "98,460.00",
                },
                {
                  date: "Feb 08",
                  desc: "Globe Telecom",
                  acct: "GCash",
                  red: true,
                  amt: "− 900.00",
                  income: false,
                  bal: "97,560.00",
                },
                {
                  date: "Feb 12",
                  desc: "Netflix, Spotify",
                  acct: "BDO Credit",
                  red: true,
                  amt: "− 950.00",
                  income: false,
                  bal: "96,610.00",
                },
                {
                  date: "Feb 15",
                  desc: "Freelance Invoice #12",
                  acct: "BDO Savings",
                  red: false,
                  amt: "+ 12,000.00",
                  income: true,
                  bal: "108,610.00",
                },
              ].map((row, i) => (
                <div key={i} className="mock-row">
                  <div className="mock-td date">{row.date}</div>
                  <div className="mock-td desc">{row.desc}</div>
                  <div className="mock-td cat-cell">
                    <span className={`cat-chip${row.red ? " red" : ""}`}>
                      {row.acct}
                    </span>
                  </div>
                  <div
                    className={`mock-td ${row.income ? "income" : "expense"}`}
                  >
                    {row.amt}
                  </div>
                  <div className="mock-td balance">{row.bal}</div>
                </div>
              ))}
            </div>

            <div className="budget-grid">
              <div className="budget-card reveal">
                <div className="budget-card-title">Budget Usage — Feb 2026</div>
                {[
                  { cat: "Groceries", pct: 89, over: false },
                  { cat: "Internet", pct: 100, over: false },
                  { cat: "Transport", pct: 54, over: false },
                  { cat: "Dining Out", pct: 124, over: true },
                  { cat: "Subscriptions", pct: 63, over: false },
                ].map((b) => (
                  <div key={b.cat} className="budget-row">
                    <span className="budget-cat">{b.cat}</span>
                    <div className="budget-bar-wrap">
                      <div
                        className={`budget-bar${b.over ? " over" : ""}`}
                        style={{ width: `${Math.min(b.pct, 100)}%` }}
                      />
                    </div>
                    <span className={`budget-pct${b.over ? " over" : ""}`}>
                      {b.pct}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="budget-card reveal">
                <div className="budget-card-title">
                  Account Config — Feb 2026
                </div>
                {[
                  {
                    account: "BDO Savings",
                    incomeBase: "₱ 65,000.00",
                    opening: "₱ 42,500.00",
                  },
                  {
                    account: "GCash",
                    incomeBase: "₱ 5,000.00",
                    opening: "₱ 1,200.00",
                  },
                ].map((a, i) => (
                  <div key={a.account}>
                    {i > 0 && (
                      <div
                        style={{
                          height: 1,
                          background: "var(--lp-border)",
                          margin: "8px 0",
                        }}
                      />
                    )}
                    <div
                      className="budget-row"
                      style={{ borderBottom: "1px solid var(--lp-border)" }}
                    >
                      <span
                        className="budget-cat"
                        style={{ color: "var(--lp-fg)", fontSize: "0.7rem" }}
                      >
                        {a.account}
                      </span>
                    </div>
                    <div className="budget-row">
                      <span className="budget-cat">Income Base</span>
                      <span
                        style={{
                          fontFamily: "var(--lp-mono)",
                          fontSize: "0.82rem",
                          color: "var(--lp-accent)",
                        }}
                      >
                        {a.incomeBase}
                      </span>
                    </div>
                    <div className="budget-row">
                      <span className="budget-cat">Opening Balance</span>
                      <span
                        style={{
                          fontFamily: "var(--lp-mono)",
                          fontSize: "0.82rem",
                          color: "var(--lp-fg)",
                        }}
                      >
                        {a.opening}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section" id="how">
          <div className="section-header reveal">
            <div className="section-tag">How it works</div>
            <h2 className="section-title">
              Four steps.
              <br />
              <em>Full visibility.</em>
            </h2>
          </div>
          <div className="steps reveal">
            {[
              {
                num: "01 / Config",
                title: "Set up accounts",
                desc: "For each account and month, define its income base and opening balance. Each account gets its own cashflow context, scoped to the month.",
              },
              {
                num: "02 / Budget",
                title: "Define rules",
                desc: "Assign fixed or percent-based budgets to categories. Percent budgets resolve against each account's income base automatically.",
              },
              {
                num: "03 / Transact",
                title: "Log everything",
                desc: "Record income and expenses as they happen. Fast entry, categorized per transaction. Your data, always fresh.",
              },
              {
                num: "04 / Report",
                title: "Read the truth",
                desc: "Cashflow, budget usage, and running balances are all computed live from your transactions. No stale summaries.",
              },
            ].map((s) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-glow" />
          <div className="section-tag reveal" style={{ textAlign: "center" }}>
            Get Started
          </div>
          <h2
            className="section-title reveal"
            style={{ maxWidth: "100%", textAlign: "center" }}
          >
            Your spreadsheet
            <br />
            called. It&apos;s <em>retiring.</em>
          </h2>
          <p className="cta-sub reveal">
            Start tracking your cashflow with precision. Free, fast, and built
            for real-life money management.
          </p>
          <div className="cta-actions reveal">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary">Create Free Account</button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn-ghost">Sign In →</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="btn-primary">Go to Dashboard</button>
              </Link>
            </SignedIn>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="footer-logo">Flowr.</div>
          <div className="footer-copy">
            © 2026 · Transactions are truth · Built on Next.js + Django
          </div>
        </footer>
      </div>
    </>
  );
}
