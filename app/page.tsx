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
        Scoped styles — all colours resolved from globals.css tokens.

        Token map (dashboard → globals.css):
          --green-primary #2d7a4f → --primary             (forest green)
          --green-mid     #3a9e66 → --chart-2 light       (mid green, gradients)
          --green-light   #e8f5ee → --secondary / --accent (pale green tint)
          --green-chip    #c6ecd5 → color-mix primary 30%  (chip border)
          --green-logo    #5ecf8a → --sidebar-primary      (bright logo green)
          --bg            #f4f6f4 → --background
          --card          #ffffff → --card
          --text          #1a2e22 → --foreground
          --muted         #7a9485 → --muted-foreground
          --border        #e4ede8 → --border
          --expense       #e05c5c → --destructive
          --warning       #d97c1a → --chart-4
          --neutral       #4a6fa5 → --chart-5
          --sidebar-bg    #1a3a2a → --sidebar
      */}
      <style>{`
        /* ── fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── page-level aliases ── */
        .lp {
          /* Surfaces */
          --lp-bg:        var(--background);           /* #f4f6f4 / dark #0c0c0a  */
          --lp-surface:   var(--card);                 /* #ffffff / dark #141410  */
          --lp-surface2:  var(--popover);              /* #ffffff / dark #1c1c17  */
          --lp-fg:        var(--foreground);           /* #1a2e22 / dark #f0ede6  */
          --lp-muted:     var(--muted-foreground);     /* #7a9485                 */
          --lp-dim:       color-mix(in oklch, var(--muted-foreground) 55%, transparent);
          --lp-border:    var(--border);               /* #e4ede8                 */
          --lp-border-lt: var(--input);

          /* Primary green — forest #2d7a4f (light) / #5ecf8a (dark) */
          --lp-accent:      var(--primary);
          --lp-accent-fg:   var(--primary-foreground); /* white (light) / dark (dark) */

          /* Pale green tint for chip backgrounds — #e8f5ee (light) */
          --lp-accent-dim:  var(--secondary);          /* oklch(0.958 0.038 152)  */
          --lp-accent-bdr:  color-mix(in oklch, var(--primary) 28%, transparent);

          /* Bright logo green for decorative hits — #5ecf8a */
          --lp-green-logo:  var(--sidebar-primary);    /* oklch(0.742 0.152 152)  */

          /* Mid green for gradients — #3a9e66 */
          --lp-green-mid:   var(--chart-2);

          /* Semantics */
          --lp-red:         var(--destructive);        /* #e05c5c / #f05a5a       */
          --lp-red-dim:     color-mix(in oklch, var(--destructive) 10%, transparent);
          --lp-amber:       var(--chart-4);            /* #d97c1a                 */
          --lp-blue:        var(--chart-5);            /* #4a6fa5                 */

          /* Dark forest for hero sections */
          --lp-forest:      var(--sidebar);            /* #1a3a2a (both modes)    */
          --lp-forest-fg:   var(--sidebar-foreground);

          /* Typography */
          --lp-mono:    'DM Mono', monospace;
          --lp-display: 'Playfair Display', serif;
          --lp-sans:    'DM Sans', var(--font-sans), sans-serif;
          --lp-radius:  var(--radius);                 /* 1rem = 16px             */

          background: var(--lp-bg);
          color: var(--lp-fg);
          font-family: var(--lp-sans);
          font-weight: 300;
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        /* Subtle grid overlay */
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
          padding: 0 48px; height: 64px;
          background: color-mix(in oklch, var(--lp-bg) 88%, transparent);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--lp-border);
          box-shadow: 0 1px 0 color-mix(in oklch, var(--lp-fg) 4%, transparent),
                      0 2px 16px color-mix(in oklch, var(--lp-fg) 5%, transparent);
        }
        .lp-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .lp-logo-mark {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--lp-green-logo) 0%, var(--lp-accent) 100%);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 13px; color: white;
          box-shadow: 0 3px 10px color-mix(in oklch, var(--lp-accent) 40%, transparent);
        }
        .lp-logo-text {
          font-size: 17px; font-weight: 800; letter-spacing: -0.3px;
          color: var(--lp-fg);
        }
        .lp-nav-links { display: flex; gap: 4px; list-style: none; }
        .lp-nav-links a {
          font-size: 13px; font-weight: 500;
          color: var(--lp-muted); text-decoration: none;
          padding: 7px 14px; border-radius: 7px;
          transition: color 0.15s, background 0.15s;
        }
        .lp-nav-links a:hover {
          color: var(--lp-fg);
          background: var(--lp-accent-dim);
        }

        /* ── BUTTONS ── */
        .btn-cta {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, var(--lp-green-mid), var(--lp-accent));
          color: white;
          border: none; padding: 9px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 14px color-mix(in oklch, var(--lp-accent) 35%, transparent);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px color-mix(in oklch, var(--lp-accent) 45%, transparent);
        }

        .btn-primary {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, var(--lp-green-mid), var(--lp-accent));
          color: white;
          border: none; padding: 12px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 16px color-mix(in oklch, var(--lp-accent) 35%, transparent);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px color-mix(in oklch, var(--lp-accent) 45%, transparent);
        }

        .btn-ghost {
          display: flex; align-items: center; gap: 7px;
          background: var(--lp-surface);
          color: var(--lp-fg);
          border: 1px solid var(--lp-border);
          padding: 12px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 8px color-mix(in oklch, var(--lp-fg) 5%, transparent);
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-ghost:hover {
          border-color: var(--lp-accent);
          color: var(--lp-accent);
        }

        /* ── HERO ── */
        .lp-hero {
          position: relative; z-index: 1;
          min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
          padding: 140px 48px 80px; max-width: 1200px; margin: 0 auto;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--lp-accent-dim);
          border: 1px solid var(--lp-accent-bdr);
          border-radius: 99px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
          color: var(--lp-accent);
          margin-bottom: 28px;
          opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--lp-accent);
        }
        .hero-title {
          font-family: var(--lp-display);
          font-size: clamp(3.2rem, 6.5vw, 6.5rem);
          line-height: 1.0; letter-spacing: -0.02em;
          color: var(--lp-fg); max-width: 820px;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.2s;
        }
        .hero-title em {
          font-style: italic;
          color: var(--lp-accent);
          text-decoration: underline;
          text-decoration-color: color-mix(in oklch, var(--lp-accent) 35%, transparent);
          text-underline-offset: 6px;
        }
        .hero-sub {
          margin-top: 28px; font-size: 1.05rem;
          color: var(--lp-muted); max-width: 480px; line-height: 1.7;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.35s;
        }
        .hero-actions {
          display: flex; gap: 12px; margin-top: 44px;
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.5s;
        }

        /* KPI stat strip */
        .hero-stats {
          display: flex; margin-top: 64px;
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: var(--lp-radius);
          overflow: hidden;
          box-shadow: 0 2px 16px color-mix(in oklch, var(--lp-fg) 6%, transparent);
          opacity: 0; animation: fadeUp 0.7s ease forwards 0.65s;
        }
        .stat {
          flex: 1; padding: 20px 24px;
          border-right: 1px solid var(--lp-border);
          position: relative;
        }
        .stat:last-child { border-right: none; }
        .stat-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; font-size: 16px;
        }
        .stat.income  .stat-icon-wrap { background: var(--lp-accent-dim); }
        .stat.expense .stat-icon-wrap { background: color-mix(in oklch, var(--lp-red) 10%, transparent); }
        .stat.neutral .stat-icon-wrap { background: color-mix(in oklch, var(--lp-blue) 12%, transparent); }
        .stat.balance .stat-icon-wrap { background: var(--lp-accent-dim); }
        .stat-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--lp-muted); margin-bottom: 6px;
        }
        .stat-value {
          font-family: var(--lp-mono); font-size: 1.25rem; font-weight: 600;
          letter-spacing: -0.5px;
        }
        .stat-value.green   { color: var(--lp-accent); }
        .stat-value.red     { color: var(--lp-red); }
        .stat-value.neutral { color: var(--lp-fg); }
        .stat-badge {
          display: inline-flex; align-items: center; gap: 3px;
          font-family: var(--lp-mono); font-size: 10px; font-weight: 600;
          padding: 3px 8px; border-radius: 20px; margin-top: 6px;
        }
        .badge-up      { background: var(--lp-accent-dim); color: var(--lp-accent); }
        .badge-down    { background: color-mix(in oklch, var(--lp-red) 10%, transparent); color: var(--lp-red); }
        .badge-neutral { background: color-mix(in oklch, var(--lp-blue) 12%, transparent); color: var(--lp-blue); }

        /* ── FORMULA BAND ── */
        .formula-band {
          position: relative; z-index: 1;
          background: var(--lp-forest);
          padding: 22px 48px; overflow: hidden;
        }
        .formula-band::before {
          content: '';
          position: absolute; top: -60px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, color-mix(in oklch, var(--lp-green-logo) 25%, transparent) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .formula-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }
        .formula-label {
          font-family: var(--lp-mono); font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: color-mix(in oklch, white 35%, transparent); margin-right: 8px;
        }
        .formula-part { font-family: var(--lp-mono); font-size: 1rem; color: color-mix(in oklch, white 60%, transparent); }
        .formula-part.hi     { color: white; font-weight: 500; }
        .formula-part.accent { color: var(--lp-green-logo); font-weight: 500; }
        .formula-part.debit  { color: color-mix(in oklch, var(--lp-red) 80%, white); font-weight: 500; }
        .formula-op { font-family: var(--lp-mono); font-size: 1rem; color: color-mix(in oklch, white 30%, transparent); padding: 0 4px; }

        /* ── SECTIONS ── */
        .lp-section {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 96px 48px;
        }
        .section-header { margin-bottom: 56px; }
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--lp-accent-dim);
          border: 1px solid var(--lp-accent-bdr);
          border-radius: 99px; padding: 5px 12px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
          color: var(--lp-accent); margin-bottom: 20px;
        }
        .section-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lp-accent); }
        .section-title {
          font-family: var(--lp-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1; letter-spacing: -0.02em; max-width: 600px;
        }
        .section-title em { font-style: italic; color: var(--lp-muted); }

        /* ── FEATURES ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        .feature-card {
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: var(--lp-radius);
          padding: 28px 24px;
          box-shadow: 0 2px 12px color-mix(in oklch, var(--lp-fg) 5%, transparent);
          position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
        }
        .feature-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, color-mix(in oklch, var(--lp-accent) 4%, transparent) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px color-mix(in oklch, var(--lp-fg) 10%, transparent);
          border-color: var(--lp-accent-bdr);
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--lp-accent-dim);
          border: 1px solid var(--lp-accent-bdr);
          color: var(--lp-accent);
          font-size: 10.5px; font-weight: 700;
          font-family: var(--lp-mono); letter-spacing: 0.06em;
          padding: 5px 10px; border-radius: 7px; margin-bottom: 20px;
        }
        .feature-title {
          font-size: 15px; font-weight: 800; letter-spacing: -0.02em;
          margin-bottom: 10px; color: var(--lp-fg);
        }
        .feature-desc { font-size: 0.85rem; color: var(--lp-muted); line-height: 1.65; }

        /* ── PREVIEW ── */
        .preview-section {
          position: relative; z-index: 1;
          background: var(--lp-forest);
          padding: 80px 0; overflow: hidden;
        }
        .preview-section::before {
          content: '';
          position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, color-mix(in oklch, var(--lp-green-logo) 15%, transparent) 0%, transparent 65%);
          pointer-events: none;
        }
        .preview-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .preview-inner .section-eyebrow {
          background: color-mix(in oklch, var(--lp-green-logo) 15%, transparent);
          border-color: color-mix(in oklch, var(--lp-green-logo) 25%, transparent);
          color: var(--lp-green-logo);
        }
        .preview-inner .section-eyebrow-dot { background: var(--lp-green-logo); }
        .preview-inner .section-title { color: white; }
        .preview-inner .section-title em { color: color-mix(in oklch, white 50%, transparent); }

        .mock-table {
          margin-top: 48px;
          border: 1px solid color-mix(in oklch, white 10%, transparent);
          border-radius: var(--lp-radius); overflow: hidden;
          font-family: var(--lp-mono); font-size: 0.78rem;
          background: color-mix(in oklch, white 6%, transparent);
        }
        .mock-header {
          display: grid; grid-template-columns: 100px 1fr 130px 130px 130px;
          background: color-mix(in oklch, white 5%, transparent);
          border-bottom: 1px solid color-mix(in oklch, white 10%, transparent);
        }
        .mock-th {
          padding: 12px 16px; font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: color-mix(in oklch, white 35%, transparent);
          border-right: 1px solid color-mix(in oklch, white 8%, transparent);
        }
        .mock-th:last-child { border-right: none; }
        .mock-row {
          display: grid; grid-template-columns: 100px 1fr 130px 130px 130px;
          border-bottom: 1px solid color-mix(in oklch, white 8%, transparent);
          transition: background 0.15s;
        }
        .mock-row:last-child { border-bottom: none; }
        .mock-row:hover { background: color-mix(in oklch, white 5%, transparent); }
        .mock-td {
          padding: 13px 16px; color: color-mix(in oklch, white 50%, transparent);
          border-right: 1px solid color-mix(in oklch, white 7%, transparent);
          white-space: nowrap;
        }
        .mock-td:last-child { border-right: none; }
        .mock-td.date    { color: color-mix(in oklch, white 30%, transparent); font-size: 0.72rem; }
        .mock-td.desc    { color: color-mix(in oklch, white 85%, transparent); }
        .mock-td.income  { color: var(--lp-green-logo); }
        .mock-td.expense { color: color-mix(in oklch, var(--lp-red) 80%, white); }
        .mock-td.balance { color: white; font-weight: 500; }
        .mock-td.cat-cell { display: flex; align-items: center; }
        .cat-chip {
          background: color-mix(in oklch, var(--lp-green-logo) 15%, transparent);
          border: 1px solid color-mix(in oklch, var(--lp-green-logo) 25%, transparent);
          color: var(--lp-green-logo);
          padding: 2px 9px; border-radius: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
        }
        .cat-chip.red {
          background: color-mix(in oklch, var(--lp-red) 12%, transparent);
          border-color: color-mix(in oklch, var(--lp-red) 25%, transparent);
          color: color-mix(in oklch, var(--lp-red) 80%, white);
        }

        /* ── BUDGET GRID ── */
        .budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
        .budget-card {
          border: 1px solid color-mix(in oklch, white 10%, transparent);
          border-radius: var(--lp-radius); padding: 22px 24px;
          background: color-mix(in oklch, white 6%, transparent);
        }
        .budget-card-title {
          font-family: var(--lp-mono); font-size: 0.6rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: color-mix(in oklch, white 35%, transparent);
          margin-bottom: 18px;
        }
        .budget-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid color-mix(in oklch, white 7%, transparent); gap: 14px;
        }
        .budget-row:last-child { border-bottom: none; padding-bottom: 0; }
        .budget-cat { font-family: var(--lp-mono); font-size: 0.75rem; color: color-mix(in oklch, white 55%, transparent); flex: 1; }
        .budget-bar-wrap {
          flex: 2; height: 6px;
          background: color-mix(in oklch, white 8%, transparent);
          border-radius: 99px; overflow: hidden;
        }
        .budget-bar {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--lp-green-logo), var(--lp-accent));
          transition: width 1s ease;
        }
        .budget-bar.warn { background: linear-gradient(90deg, #ffc107, var(--lp-amber)); }
        .budget-bar.over { background: linear-gradient(90deg, #ff8080, var(--lp-red)); }
        .budget-pct { font-family: var(--lp-mono); font-size: 0.68rem; color: color-mix(in oklch, white 35%, transparent); width: 36px; text-align: right; }
        .budget-pct.over { color: color-mix(in oklch, var(--lp-red) 80%, white); }

        /* ── HOW IT WORKS ── */
        .steps {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
          margin-top: 48px;
        }
        .step {
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: var(--lp-radius); padding: 26px 22px;
          box-shadow: 0 2px 8px color-mix(in oklch, var(--lp-fg) 5%, transparent);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .step:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px color-mix(in oklch, var(--lp-fg) 10%, transparent);
        }
        .step-num {
          width: 36px; height: 36px;
          background: var(--lp-accent-dim);
          border: 1px solid var(--lp-accent-bdr);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: var(--lp-accent);
          font-family: var(--lp-mono); margin-bottom: 18px;
        }
        .step-title { font-size: 15px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; color: var(--lp-fg); }
        .step-desc  { font-size: 0.83rem; color: var(--lp-muted); line-height: 1.6; }

        /* ── CTA ── */
        .cta-section {
          position: relative; z-index: 1; text-align: center;
          padding: 100px 48px; max-width: 1200px; margin: 0 auto;
        }
        .cta-card {
          background: var(--lp-forest);
          border-radius: 24px; padding: 72px 48px;
          position: relative; overflow: hidden;
          box-shadow: 0 24px 64px color-mix(in oklch, var(--lp-fg) 14%, transparent);
        }
        .cta-card::before {
          content: '';
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, color-mix(in oklch, var(--lp-green-logo) 15%, transparent) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: color-mix(in oklch, var(--lp-green-logo) 15%, transparent);
          border: 1px solid color-mix(in oklch, var(--lp-green-logo) 25%, transparent);
          border-radius: 99px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; color: var(--lp-green-logo);
          margin-bottom: 24px; position: relative; z-index: 1;
        }
        .cta-title {
          font-family: var(--lp-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: white; line-height: 1.1; letter-spacing: -0.02em;
          position: relative; z-index: 1; margin-bottom: 16px;
        }
        .cta-title em { font-style: italic; color: var(--lp-green-logo); }
        .cta-sub {
          color: color-mix(in oklch, white 55%, transparent);
          font-size: 1rem; max-width: 480px; margin: 0 auto 36px;
          position: relative; z-index: 1;
        }
        .cta-actions {
          display: flex; gap: 12px; justify-content: center;
          position: relative; z-index: 1;
        }

        /* ── FOOTER ── */
        .lp-footer {
          position: relative; z-index: 1;
          background: var(--lp-forest);
          border-top: 1px solid color-mix(in oklch, white 8%, transparent);
          padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-logo { display: flex; align-items: center; gap: 9px; }
        .footer-logo-mark {
          width: 26px; height: 26px;
          background: linear-gradient(135deg, var(--lp-green-logo) 0%, var(--lp-accent) 100%);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 11px; color: white;
        }
        .footer-logo-text { font-size: 15px; font-weight: 700; color: color-mix(in oklch, white 70%, transparent); }
        .footer-copy {
          font-family: var(--lp-mono); font-size: 11px;
          color: color-mix(in oklch, white 25%, transparent); letter-spacing: 0.04em;
        }
        .footer-links { display: flex; gap: 20px; list-style: none; }
        .footer-links a {
          font-size: 12.5px; font-weight: 500;
          color: color-mix(in oklch, white 35%, transparent);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-links a:hover { color: color-mix(in oklch, white 70%, transparent); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .lp-nav { padding: 0 24px; }
          .lp-nav-links { display: none; }
          .lp-hero { padding: 120px 24px 60px; }
          .hero-stats { flex-direction: column; }
          .stat { border-right: none; border-bottom: 1px solid var(--lp-border); }
          .stat:last-child { border-bottom: none; }
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
          .cta-card { padding: 48px 24px; }
        }
      `}</style>

      <div className="lp">
        {/* ── NAV ── */}
        <nav className="lp-nav">
          <div className="lp-logo">
            <svg
              height="28"
              viewBox="0 0 120 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Flowr"
            >
              <defs>
                <linearGradient
                  id="nav-logo-grad"
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#2d7a4f" />
                  <stop offset="100%" stopColor="#5ecf8a" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="26"
                fontFamily="'Playfair Display', serif"
                fontWeight="700"
                fontStyle="italic"
                fontSize="28"
                fill="url(#nav-logo-grad)"
              >
                Flowr
              </text>
            </svg>
          </div>
          <ul className="lp-nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#preview">Preview</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="#how">How it works</a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Personal Cashflow Tracker — Transaction-First
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
                badge: "Feb 2026",
                badgeTone: "neutral",
                icon: "🏦",
                cls: "neutral",
              },
              {
                label: "Total Income",
                value: "+ ₱ 65,000.00",
                tone: "green",
                badge: "3 transactions",
                badgeTone: "up",
                icon: "↑",
                cls: "income",
              },
              {
                label: "Total Expenses",
                value: "− ₱ 38,240.00",
                tone: "red",
                badge: "14 transactions",
                badgeTone: "down",
                icon: "↓",
                cls: "expense",
              },
              {
                label: "Net Balance",
                value: "₱ 69,260.00",
                tone: "green",
                badge: "↑ Surplus",
                badgeTone: "up",
                icon: "✓",
                cls: "balance",
              },
            ].map((s) => (
              <div key={s.label} className={`stat ${s.cls}`}>
                <div className="stat-icon-wrap">{s.icon}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.tone}`}>{s.value}</div>
                <div className={`stat-badge badge-${s.badgeTone}`}>
                  {s.badge}
                </div>
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
            <span className="formula-part" style={{ fontSize: "0.72rem" }}>
              Computed daily. Never stored.
            </span>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="lp-section" id="features">
          <div className="section-header reveal">
            <div className="section-eyebrow">
              <span className="section-eyebrow-dot" />
              Core Features
            </div>
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
                <div className="feature-icon-tag">{f.icon}</div>
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
              <div className="section-eyebrow">
                <span className="section-eyebrow-dot" />
                Interface Preview
              </div>
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
                  { cat: "Groceries", pct: 89, tier: "" },
                  { cat: "Internet", pct: 100, tier: "warn" },
                  { cat: "Transport", pct: 54, tier: "" },
                  { cat: "Dining Out", pct: 124, tier: "over" },
                  { cat: "Subscriptions", pct: 63, tier: "" },
                ].map((b) => (
                  <div key={b.cat} className="budget-row">
                    <span className="budget-cat">{b.cat}</span>
                    <div className="budget-bar-wrap">
                      <div
                        className={`budget-bar${b.tier ? ` ${b.tier}` : ""}`}
                        style={{ width: `${Math.min(b.pct, 100)}%` }}
                      />
                    </div>
                    <span
                      className={`budget-pct${b.tier === "over" ? " over" : ""}`}
                    >
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
                          background:
                            "color-mix(in oklch, white 8%, transparent)",
                          margin: "4px 0",
                        }}
                      />
                    )}
                    <div
                      className="budget-row"
                      style={{
                        borderBottom:
                          "1px solid color-mix(in oklch, white 8%, transparent)",
                      }}
                    >
                      <span
                        className="budget-cat"
                        style={{
                          color: "color-mix(in oklch, white 80%, transparent)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
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
                          color: "var(--lp-green-logo)",
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
                          color: "color-mix(in oklch, white 80%, transparent)",
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
            <div className="section-eyebrow">
              <span className="section-eyebrow-dot" />
              How it works
            </div>
            <h2 className="section-title">
              Four steps.
              <br />
              <em>Full visibility.</em>
            </h2>
          </div>
          <div className="steps reveal">
            {[
              {
                num: "01",
                title: "Set up accounts",
                desc: "For each account and month, define its income base and opening balance. Each account gets its own cashflow context, scoped to the month.",
              },
              {
                num: "02",
                title: "Define rules",
                desc: "Assign fixed or percent-based budgets to categories. Percent budgets resolve against each account's income base automatically.",
              },
              {
                num: "03",
                title: "Log everything",
                desc: "Record income and expenses as they happen. Fast entry, categorized per transaction. Your data, always fresh.",
              },
              {
                num: "04",
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
          <div className="cta-card reveal">
            <div className="cta-eyebrow">Get Started</div>
            <h2 className="cta-title">
              Your spreadsheet
              <br />
              called. It&apos;s <em>retiring.</em>
            </h2>
            <p className="cta-sub">
              Start tracking your cashflow with precision. Free, fast, and built
              for real-life money management.
            </p>
            <div className="cta-actions">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="btn-primary">Create Free Account</button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button
                    className="btn-ghost"
                    style={{
                      borderColor:
                        "color-mix(in oklch, white 15%, transparent)",
                      color: "color-mix(in oklch, white 70%, transparent)",
                    }}
                  >
                    Sign In →
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="btn-primary">Go to Dashboard</button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="footer-logo">
            <svg
              height="22"
              viewBox="0 0 120 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Flowr"
            >
              <defs>
                <linearGradient
                  id="footer-logo-grad"
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#2d7a4f" />
                  <stop offset="100%" stopColor="#5ecf8a" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="26"
                fontFamily="'Playfair Display', serif"
                fontWeight="700"
                fontStyle="italic"
                fontSize="28"
                fill="url(#footer-logo-grad)"
              >
                Flowr
              </text>
            </svg>
          </div>
          <ul
            style={{
              display: "flex",
              gap: 24,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <Link
                href="/privacy"
                style={{
                  fontFamily: "var(--lp-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--lp-dim)",
                  textDecoration: "none",
                }}
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                style={{
                  fontFamily: "var(--lp-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--lp-dim)",
                  textDecoration: "none",
                }}
              >
                Terms
              </Link>
            </li>
          </ul>
          <div className="footer-copy">
            © {new Date().getFullYear()} Flowr. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
