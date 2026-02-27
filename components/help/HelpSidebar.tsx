"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_SECTIONS = [
  {
    heading: "Getting Started",
    links: [
      { label: "Overview", href: "/help/overview" },
      { label: "Quick Start", href: "/help/quick-start" },
      { label: "Adding your first account", href: "/help/first-account" },
      { label: "Your first transaction", href: "/help/first-transaction" },
    ],
  },
  {
    heading: "Core Concepts",
    links: [
      { label: "Transactions", href: "/help/transactions" },
      { label: "Accounts", href: "/help/accounts" },
      { label: "Categories", href: "/help/categories" },
      { label: "Month Config", href: "/help/month-config" },
      { label: "Budgets", href: "/help/budgets" },
    ],
  },
  {
    heading: "Reports",
    links: [
      { label: "Cashflow Report", href: "/help/cashflow-report" },
      { label: "Budget Usage", href: "/help/budget-usage" },
      { label: "Daily Running Balance", href: "/help/daily-balance" },
    ],
  },
  {
    heading: "Account & Billing",
    links: [
      { label: "Plan limits", href: "/help/plan-limits" },
      { label: "Upgrade to Pro", href: "/help/upgrade-pro" },
      { label: "Export data", href: "/help/export-data" },
    ],
  },
];

export function HelpSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky hidden md:block" style={{ top: "88px" }}>
      {SIDEBAR_SECTIONS.map((section) => (
        <div key={section.heading} className="mb-7">
          <div
            className="uppercase pb-2 mb-2 border-b"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.14em",
              color: "#5a5750",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            {section.heading}
          </div>
          <ul className="flex flex-col gap-px list-none">
            {section.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-2 py-1 rounded no-underline text-sm transition-all duration-200"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 300,
                      color: isActive ? "#c8f05a" : "#8a8578",
                      background: isActive ? "rgba(200,240,90,0.12)" : "transparent",
                      borderRadius: "4px",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
