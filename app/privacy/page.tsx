import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Flowr",
  description:
    "How Flowr collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "March 11, 2025";

export default function PrivacyPage() {
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
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
          <Link href="/dashboard" className="btn-dash">
            Open App
          </Link>
        </nav>

        <header className="legal-hero">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: {LAST_UPDATED}</p>
        </header>

        <main className="legal-content">
          <hr className="legal-divider" />

          <div className="legal-callout">
            <p>
              Flowr is a personal finance tool. We collect only what is
              necessary to provide the service. We do not sell your data, ever.
            </p>
          </div>

          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly when you create an
              account, add transactions, configure budgets, or contact us for
              support.
            </p>
            <ul>
              <li>
                <strong>Account data</strong> — name, email address, and profile
                image via Clerk (Google OAuth or email/password).
              </li>
              <li>
                <strong>Financial data</strong> — transactions, categories,
                budgets, account names, and month config values you enter.
              </li>
              <li>
                <strong>Usage data</strong> — pages visited, features used, and
                error logs to improve the product.
              </li>
              <li>
                <strong>Billing data</strong> — subscription tier and payment
                status via Stripe. We do not store card numbers.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Flowr service.</li>
              <li>
                Authenticate your identity and secure your account via Clerk.
              </li>
              <li>
                Process subscription payments and enforce plan limits via
                Stripe.
              </li>
              <li>
                Send transactional emails (account confirmations, billing
                receipts).
              </li>
              <li>Diagnose bugs and monitor application health.</li>
            </ul>
            <p>
              We do not use your financial data to train AI models. We do not
              share your financial data with advertisers or data brokers.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Data Storage & Security</h2>
            <p>
              Your data is stored in a PostgreSQL database hosted on Neon (AWS
              infrastructure). All data in transit is encrypted via TLS.
              Database connections require SSL.
            </p>
            <p>
              Authentication is handled entirely by Clerk, which is SOC 2 Type
              II certified. We never store passwords. Session tokens are
              short-lived JWTs.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Third-Party Services</h2>
            <p>We use the following services to operate Flowr:</p>
            <ul>
              <li>
                <strong>Clerk</strong> — authentication and user management.{" "}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener"
                >
                  clerk.com/privacy
                </a>
              </li>
              <li>
                <strong>Stripe</strong> — payment processing.{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener"
                >
                  stripe.com/privacy
                </a>
              </li>
              <li>
                <strong>Neon</strong> — PostgreSQL database hosting.{" "}
                <a
                  href="https://neon.tech/privacy-policy"
                  target="_blank"
                  rel="noopener"
                >
                  neon.tech/privacy-policy
                </a>
              </li>
              <li>
                <strong>Vercel</strong> — frontend hosting.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener"
                >
                  vercel.com/legal/privacy-policy
                </a>
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Cookies & Tracking</h2>
            <p>
              Flowr uses session cookies set by Clerk for authentication. We do
              not use third-party advertising cookies or cross-site tracking
              pixels. Minimal analytics (page views, error rates) may be
              collected to monitor performance — no personally identifiable
              information is included.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. Upon
              account deletion, your financial data and profile are permanently
              removed within 30 days, except where retention is required by law.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access a copy of the data we hold about you.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>
                Export your transaction data via the in-app export feature
                (Excel/PDF).
              </li>
              <li>Opt out of non-essential communications.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@flowr.app">privacy@flowr.app</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Flowr is not directed at children under 16. We do not knowingly
              collect personal information from children. Contact us immediately
              if you believe a child has provided us with their information.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time and will update the
              date above. Continued use of Flowr after changes constitutes
              acceptance.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact</h2>
            <ul>
              <li>
                Email: <a href="mailto:privacy@flowr.app">privacy@flowr.app</a>
              </li>
              <li>
                Account deletion: Settings → Account → Delete Account in the
                app.
              </li>
            </ul>
          </div>

          <div className="legal-callout">
            <p>
              Also see our <Link href="/terms">Terms & Conditions</Link> for the
              rules governing use of the Flowr service.
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
