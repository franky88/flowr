"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── CALLOUT ─── */
type CalloutVariant = "tip" | "info" | "warn";

const calloutStyles: Record<CalloutVariant, { border: string; bg: string; iconColor: string; iconBorder: string }> = {
  tip:  { border: "rgba(200,240,90,0.3)",  bg: "rgba(200,240,90,0.08)",   iconColor: "#c8f05a", iconBorder: "rgba(200,240,90,0.4)" },
  info: { border: "rgba(90,158,240,0.3)",  bg: "rgba(90,158,240,0.05)",   iconColor: "#5a9ef0", iconBorder: "rgba(90,158,240,0.4)" },
  warn: { border: "rgba(240,90,90,0.3)",   bg: "rgba(240,90,90,0.08)",    iconColor: "#f05a5a", iconBorder: "rgba(240,90,90,0.4)" },
};

export function Callout({ variant = "info", label, children }: { variant?: CalloutVariant; label: string; children: React.ReactNode }) {
  const s = calloutStyles[variant];
  return (
    <div
      className="flex gap-3 items-start rounded mb-5 p-4"
      style={{ border: `1px solid ${s.border}`, background: s.bg }}
    >
      <span
        className="shrink-0 mt-px uppercase"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.08em",
          color: s.iconColor,
          border: `1px solid ${s.iconBorder}`,
          padding: "3px 7px",
          borderRadius: "2px",
        }}
      >
        {label}
      </span>
      <div
        className="text-sm leading-relaxed"
        style={{ color: "#8a8578", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── FORMULA BLOCK ─── */
export function FormulaBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded p-5 mb-5"
      style={{
        background: "#141410",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "3px solid #c8f05a",
      }}
    >
      <div
        className="uppercase mb-2"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.12em", color: "#5a5750" }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", color: "#f0ede6", fontWeight: 500 }}>
        {children}
      </div>
    </div>
  );
}

export function FormulaOp({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#8a8578", margin: "0 6px" }}>{children}</span>;
}

export function FormulaResult({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#c8f05a" }}>{children}</span>;
}

/* ─── STEP LIST ─── */
export function StepList({ children }: { children: React.ReactNode }) {
  return <ol className="list-none p-0 mb-5">{children}</ol>;
}

export function StepItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li
      className="flex gap-4 items-start py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span
        className="shrink-0 mt-0.5 flex items-center justify-center"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          color: "#c8f05a",
          background: "rgba(200,240,90,0.12)",
          border: "1px solid rgba(200,240,90,0.3)",
          width: "28px",
          height: "28px",
          borderRadius: "2px",
          counterIncrement: "steps",
        }}
      >
        {/* number injected via CSS counter in parent — we use a wrapper */}
      </span>
      <div>
        <div className="mb-1 font-medium" style={{ fontSize: "0.9rem", color: "#f0ede6" }}>{title}</div>
        <div style={{ fontSize: "0.82rem", color: "#8a8578", lineHeight: 1.65 }}>{children}</div>
      </div>
    </li>
  );
}

/* ─── STEP LIST WITH AUTO-NUMBERING ─── */
type Step = { title: string; description: React.ReactNode };

export function Steps({ items }: { items: Step[] }) {
  return (
    <ol className="list-none p-0 mb-5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-4 items-start py-4"
          style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
        >
          <span
            className="shrink-0 mt-0.5 flex items-center justify-center text-xs"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "#c8f05a",
              background: "rgba(200,240,90,0.12)",
              border: "1px solid rgba(200,240,90,0.3)",
              width: "28px",
              height: "28px",
              minWidth: "28px",
              borderRadius: "2px",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <div className="mb-1 font-medium" style={{ fontSize: "0.9rem", color: "#f0ede6" }}>{item.title}</div>
            <div style={{ fontSize: "0.82rem", color: "#8a8578", lineHeight: 1.65 }}>{item.description}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─── COMPARISON TABLE ─── */
export function ComparisonTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="mb-6 overflow-hidden rounded" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: "#141410" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 uppercase"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "#5a5750",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ borderBottom: ri < rows.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
              className="transition-colors hover:bg-[#1c1c17]"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 align-top"
                  style={{ fontSize: "0.84rem", color: ci === 0 ? "#f0ede6" : "#8a8578" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Check = () => <span style={{ color: "#c8f05a", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>✓</span>;
export const Cross = () => <span style={{ color: "#f05a5a", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>✕</span>;

/* ─── FAQ LIST ─── */
type FaqItem = { question: string; answer: React.ReactNode };

export function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mb-5 overflow-hidden rounded" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer transition-colors duration-150 hover:bg-[#1c1c17]"
              style={{ background: "transparent", border: "none" }}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span style={{ fontSize: "0.86rem", color: "#f0ede6" }}>{item.question}</span>
              <span
                className="shrink-0 transition-transform duration-200"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  color: isOpen ? "#c8f05a" : "#5a5750",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "600px" : "0" }}
            >
              <div
                className="px-5 pt-4 pb-5 text-sm leading-relaxed"
                style={{
                  color: "#8a8578",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  lineHeight: 1.7,
                }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ARTICLE NAV ─── */
type NavLink = { href: string; label: string };

export function ArticleNav({ prev, next }: { prev?: NavLink; next?: NavLink }) {
  return (
    <div
      className="grid gap-3 mt-14 pt-8"
      style={{
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="block rounded p-5 no-underline transition-all duration-200 hover:bg-[#1c1c17]"
          style={{
            background: "#141410",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "4px",
          }}
        >
          <div
            className="uppercase mb-1.5"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#5a5750" }}
          >
            ← Previous
          </div>
          <div style={{ fontSize: "0.86rem", color: "#f0ede6" }}>{prev.label}</div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="block rounded p-5 no-underline text-right transition-all duration-200 hover:bg-[#1c1c17]"
          style={{
            background: "#141410",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "4px",
          }}
        >
          <div
            className="uppercase mb-1.5"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#5a5750" }}
          >
            Next →
          </div>
          <div style={{ fontSize: "0.86rem", color: "#f0ede6" }}>{next.label}</div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

/* ─── KBD ─── */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block mx-0.5"
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        color: "#8a8578",
        background: "#1c1c17",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "3px 8px",
        borderRadius: "3px",
      }}
    >
      {children}
    </span>
  );
}

/* ─── INLINE CODE ─── */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.82rem",
        color: "#c8f05a",
        background: "rgba(200,240,90,0.12)",
        padding: "2px 6px",
        borderRadius: "2px",
      }}
    >
      {children}
    </code>
  );
}

/* ─── DIVIDER ─── */
export function Divider() {
  return <hr className="my-8" style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)" }} />;
}

/* ─── BREADCRUMB ─── */
export function Breadcrumb({ section, current }: { section: string; current: string }) {
  return (
    <div
      className="flex items-center gap-2 mb-7"
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <Link href="/help" className="no-underline transition-colors hover:opacity-80" style={{ color: "#5a5750" }}>
        Help
      </Link>
      <span style={{ color: "#5a5750", opacity: 0.35 }}>/</span>
      <span style={{ color: "#5a5750" }}>{section}</span>
      <span style={{ color: "#5a5750", opacity: 0.35 }}>/</span>
      <span style={{ color: "#8a8578" }}>{current}</span>
    </div>
  );
}

/* ─── PAGE HEADER ─── */
type MetaType = "guide" | "faq" | "ref";

const metaStyles: Record<MetaType, { color: string; border: string }> = {
  guide: { color: "#c8f05a", border: "rgba(200,240,90,0.3)" },
  faq:   { color: "#5a9ef0", border: "rgba(90,158,240,0.3)" },
  ref:   { color: "#8a8578", border: "rgba(255,255,255,0.12)" },
};

export function PageHeader({
  tag,
  title,
  metaType,
  metaLabel,
}: {
  tag: string;
  title: React.ReactNode;
  metaType: MetaType;
  metaLabel: string;
}) {
  const ms = metaStyles[metaType];
  return (
    <div className="relative z-10 max-w-[1200px] mx-auto px-12 pt-[120px] pb-12">
      <div
        className="uppercase mb-3.5"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.66rem",
          letterSpacing: "0.14em",
          color: "#c8f05a",
          animation: "fadeUp 0.5s ease forwards 0.1s",
          opacity: 0,
        }}
      >
        {tag}
      </div>
      <h1
        className="max-w-[720px] leading-[1.05] tracking-tight"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
          letterSpacing: "-0.02em",
          color: "#f0ede6",
          animation: "fadeUp 0.6s ease forwards 0.18s",
          opacity: 0,
        }}
      >
        {title}
      </h1>
      <div
        className="flex items-center gap-5 mt-5"
        style={{ animation: "fadeUp 0.6s ease forwards 0.28s", opacity: 0 }}
      >
        <span
          className="uppercase"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: ms.color,
            border: `1px solid ${ms.border}`,
            padding: "4px 10px",
            borderRadius: "2px",
          }}
        >
          {metaType.toUpperCase()}
        </span>
        <span
          className="uppercase"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "#5a5750",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "4px 10px",
            borderRadius: "2px",
          }}
        >
          {metaLabel}
        </span>
      </div>
    </div>
  );
}

/* ─── ARTICLE PROSE WRAPPERS ─── */
export function ArticleH2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-10 mb-3.5 first:mt-0 leading-tight"
      style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700, color: "#f0ede6" }}
    >
      {children}
    </h2>
  );
}

export function ArticleH3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mt-8 mb-2.5 italic leading-snug"
      style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#f0ede6" }}
    >
      {children}
    </h3>
  );
}

export function ArticleP({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 max-w-[660px] leading-[1.8]"
      style={{ fontSize: "0.92rem", color: "#8a8578", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
    >
      {children}
    </p>
  );
}

export function ArticleUl({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="mb-4 pl-5"
      style={{ fontSize: "0.92rem", color: "#8a8578", lineHeight: 1.7 }}
    >
      {children}
    </ul>
  );
}

export function ArticleLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="mb-1.5" style={{ color: "#8a8578", fontSize: "0.92rem" }}>
      {children}
    </li>
  );
}

export function ArticleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="transition-opacity hover:opacity-75"
      style={{
        color: "#c8f05a",
        textDecoration: "none",
        borderBottom: "1px solid rgba(200,240,90,0.3)",
      }}
    >
      {children}
    </Link>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "#f0ede6", fontWeight: 500 }}>{children}</strong>;
}
