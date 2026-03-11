import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Flowr",
  description:
    "The terms governing your use of the Flowr personal finance application.",
};

const LAST_UPDATED = "March 11, 2025";

export default function TermsPage() {
  return (
    <>
      <style>{`
        .legal-page {
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
          min-height: 100vh;
        }

        /* ── Nav ── */
        .legal-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          background: color-mix(in oklch, var(--background) 88%, transparent);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .legal-logo {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.5rem;
          color: var(--foreground);
          text-decoration: none;
        }
        .legal-logo span { color: var(--primary); font-style: normal; }
        .legal-nav-links {
          display: flex; gap: 32px; list-style: none; margin: 0; padding: 0;
        }
        .legal-nav-links a {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          text-decoration: none;
          transition: color 0.2s;
        }
        .legal-nav-links a:hover { color: var(--primary); }
        .btn-dash {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--primary);
          color: var(--primary-foreground);
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          font-weight: 600;
        }

        /* ── Hero ── */
        .legal-hero {
          padding: 140px 48px 64px;
          max-width: 800px;
          margin: 0 auto;
        }
        .legal-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 16px;
        }
        .legal-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 16px;
          color: var(--foreground);
        }
        .legal-subtitle {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          font-family: var(--font-mono);
        }

        /* ── Content ── */
        .legal-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 48px 80px;
        }
        .legal-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 48px 0;
        }
        .legal-section { margin-bottom: 48px; }
        .legal-section h2 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--foreground);
        }
        .legal-section p {
          font-size: 0.875rem;
          line-height: 1.85;
          color: var(--muted-foreground);
          margin-bottom: 12px;
        }
        .legal-section ul {
          list-style: none;
          margin: 12px 0; padding: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .legal-section ul li {
          font-size: 0.875rem;
          line-height: 1.75;
          color: var(--muted-foreground);
          padding-left: 20px;
          position: relative;
        }
        .legal-section ul li::before {
          content: '—';
          position: absolute; left: 0;
          color: var(--border);
        }
        .legal-section strong {
          color: var(--foreground);
          font-weight: 500;
        }
        .legal-section em {
          font-style: italic;
          color: var(--foreground);
        }
        .legal-section a { color: var(--primary); text-decoration: none; }
        .legal-section a:hover { text-decoration: underline; }

        /* ── Callout ── */
        .legal-callout {
          background: var(--card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--primary);
          border-radius: var(--radius-sm);
          padding: 20px 24px;
          margin: 24px 0;
        }
        .legal-callout p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--muted-foreground);
        }
        .legal-callout a { color: var(--primary); text-decoration: none; }
        .legal-callout a:hover { text-decoration: underline; }

        /* warning variant — uses chart-4 (amber) */
        .legal-callout.warning {
          border-left-color: var(--chart-4);
        }

        /* ── Footer ── */
        .legal-footer {
          border-top: 1px solid var(--border);
          padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-logo-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1rem;
          color: var(--muted-foreground);
        }
        .footer-links {
          display: flex; gap: 24px; list-style: none; margin: 0; padding: 0;
        }
        .footer-links a {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--foreground); }
        .footer-copy {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          color: var(--muted-foreground);
        }

        @media (max-width: 768px) {
          .legal-nav { padding: 16px 24px; }
          .legal-nav-links { display: none; }
          .legal-hero { padding: 120px 24px 48px; }
          .legal-content { padding: 0 24px 64px; }
          .legal-footer { flex-direction: column; gap: 16px; padding: 24px; text-align: center; }
          .footer-links { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      <div className="legal-page">
        <nav className="legal-nav">
          <Link href="/" className="legal-logo">
            Flowr<span>.</span>
          </Link>
          <ul className="legal-nav-links">
            <li>
              <a href="/#features">Features</a>
            </li>
            <li>
              <a href="/#how">How it works</a>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
          <Link href="/dashboard" className="btn-dash">
            Open App
          </Link>
        </nav>

        <header className="legal-hero">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Terms & Conditions</h1>
          <p className="legal-subtitle">Last updated: {LAST_UPDATED}</p>
        </header>

        <main className="legal-content">
          <hr className="legal-divider" />

          <div className="legal-callout">
            <p>
              By creating a Flowr account, you agree to these terms. They are
              written in plain language — no legalese.
            </p>
          </div>

          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Flowr ("the Service"), you agree to be bound
              by these Terms & Conditions and our Privacy Policy. If you do not
              agree, do not use the Service. These terms apply to all users,
              including free and Pro subscribers.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              Flowr is a personal cashflow and budget tracking application. It
              allows you to record transactions, manage budget categories, and
              view cashflow reports on a monthly basis.
            </p>
            <div className="legal-callout warning">
              <p>
                Flowr is a personal finance <em>tracker</em>, not financial
                advice software. Nothing in the app constitutes financial, tax,
                investment, or legal advice. Consult a qualified professional
                for financial decisions.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>3. Account Registration</h2>
            <p>
              You must create an account to use Flowr via email/password or
              Google OAuth through Clerk.
            </p>
            <ul>
              <li>
                You are responsible for maintaining the security of your
                credentials.
              </li>
              <li>You must provide accurate information when registering.</li>
              <li>
                One person may not maintain multiple accounts to circumvent plan
                limits.
              </li>
              <li>You must be at least 16 years old to create an account.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Subscription Plans & Billing</h2>
            <p>
              Flowr offers a free tier and a paid Pro subscription. Plan
              features and limits are described on the pricing page and may
              change with notice.
            </p>
            <ul>
              <li>
                Payments are processed by Stripe. By subscribing you agree to
                Stripe's terms.
              </li>
              <li>
                Subscriptions renew automatically unless cancelled before the
                renewal date.
              </li>
              <li>
                You may cancel at any time. Access continues until the end of
                the paid period.
              </li>
              <li>
                Refunds are handled case-by-case — contact support within 7 days
                of a charge.
              </li>
              <li>
                We reserve the right to change pricing with 30 days' notice to
                existing subscribers.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose.</li>
              <li>
                Attempt to reverse-engineer, scrape, or extract data in bulk.
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service.
              </li>
              <li>
                Use automated tools to access the Service at scale without prior
                written consent.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
                or its infrastructure.
              </li>
              <li>
                Impersonate another user or provide false identity information.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Your Data</h2>
            <p>
              You retain full ownership of all financial data you enter into
              Flowr. We do not claim any rights over your transaction records,
              budget configurations, or account data.
            </p>
            <p>
              You may export your data at any time via the in-app export feature
              (Excel and PDF). Upon account deletion, your data is permanently
              removed within 30 days.
            </p>
            <p>
              By using the Service, you grant us a limited, non-exclusive
              license to store and process your data solely to provide the
              Service to you.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              The Flowr name, logo, application design, and underlying software
              are owned by Flowr and protected by applicable intellectual
              property laws. You are granted a limited, non-transferable license
              to use the Service for personal, non-commercial purposes only.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without
              warranties of any kind. We do not warrant that the Service will be
              uninterrupted, error-free, or free of security vulnerabilities.
              Financial calculations are based on data you enter — we are not
              responsible for errors arising from incorrect or incomplete data
              entry.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Flowr shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages. Our total liability shall not exceed the amount
              you paid for the Service in the 12 months preceding the claim.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account without
              prior notice if you have violated these Terms. You may delete your
              account at any time via Settings → Account → Delete Account. Upon
              termination, your right to use the Service ceases immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes via email or an in-app notice. Continued use
              after changes take effect constitutes acceptance of the revised
              Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by applicable law. Disputes will be
              resolved through good-faith negotiation first, and if unresolved,
              through binding arbitration.
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Contact</h2>
            <ul>
              <li>
                General: <a href="mailto:legal@flowr.app">legal@flowr.app</a>
              </li>
              <li>
                Billing disputes:{" "}
                <a href="mailto:billing@flowr.app">billing@flowr.app</a>
              </li>
            </ul>
          </div>

          <div className="legal-callout">
            <p>
              Also see our <Link href="/privacy">Privacy Policy</Link> for
              details on how we collect and handle your personal data.
            </p>
          </div>
        </main>

        <footer className="legal-footer">
          <div className="footer-logo-text">Flowr.</div>
          <ul className="footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
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
