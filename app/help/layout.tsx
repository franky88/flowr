import type { Metadata } from "next";
import { HelpNav } from "@/components/help/HelpNav";
import { HelpSidebar } from "@/components/help/HelpSidebar";

export const metadata: Metadata = {
  title: "Flowr — Help & Documentation",
  description: "Guides, references, and answers for every part of Flowr.",
};

export default function HelpArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "#0c0c0a",
        color: "#f0ede6",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
      }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <HelpNav />

      {/* Page header + article content is in the page itself,
          sidebar is injected here so it's always present */}
      <div className="relative z-10">
        {children}
      </div>

      <footer
        className="relative z-10 flex items-center justify-between px-12 py-7"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="italic"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#8a8578" }}
        >
          Flowr.
        </div>
        <ul className="flex gap-6 list-none">
          {["Privacy", "Terms", "Status", "Changelog"].map((link) => (
            <li key={link}>
              <a
                href="#"
                className="no-underline uppercase transition-colors hover:opacity-80"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: "#5a5750",
                }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "#5a5750" }}
        >
          © 2026 · Transactions are truth
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared article page shell ─── */
export function ArticleShell({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {header}
      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "0 48px" }} />
      <div
        className="relative z-10 max-w-[1200px] mx-auto px-12 pt-12 pb-20"
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "56px", alignItems: "start" }}
      >
        <HelpSidebar />
        <main
          className="min-w-0"
          style={{ animation: "fadeUp 0.6s ease forwards 0.35s", opacity: 0 }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
