"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HelpNav() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/dashboard/transactions" },
    { label: "Budgets", href: "/dashboard/budgets" },
    { label: "Help", href: "/help" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-12 py-5 border-b"
      style={{
        background: "rgba(12,12,10,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <Link
        href="/help"
        className="font-serif text-2xl italic tracking-tight no-underline"
        style={{
          color: "var(--fg, #f0ede6)",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Flowr<span style={{ color: "#c8f05a", fontStyle: "normal" }}>.</span>
      </Link>

      <ul className="flex gap-8 list-none">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                className="no-underline transition-colors duration-200 uppercase tracking-widest"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  color: isActive ? "#c8f05a" : "#8a8578",
                }}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/dashboard"
        className="no-underline uppercase tracking-wider font-medium transition-all duration-200 hover:opacity-80"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          background: "#c8f05a",
          color: "#0c0c0a",
          padding: "10px 20px",
          borderRadius: "4px",
        }}
      >
        Open App
      </Link>
    </nav>
  );
}
