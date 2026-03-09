import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanFeature {
  label: string;
  included: boolean;
  note?: string;
}

interface Plan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  features: PlanFeature[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals getting started with cashflow tracking.",
    cta: "Get started",
    ctaHref: "/sign-up",
    highlighted: false,
    features: [
      { label: "1 account", included: true },
      { label: "Up to 10 categories", included: true },
      { label: "3 months of history", included: true },
      { label: "Fixed & percent budgets", included: true },
      { label: "Daily running balance", included: true },
      { label: "CSV export", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "/ month",
    description:
      "For people who track every account and want their full financial history.",
    badge: "Most popular",
    cta: "Upgrade to Pro",
    ctaHref: "/dashboard/billing",
    highlighted: true,
    features: [
      { label: "Unlimited accounts", included: true },
      { label: "Unlimited categories", included: true },
      { label: "Full history — all months", included: true },
      { label: "Fixed & percent budgets", included: true },
      { label: "Daily running balance", included: true },
      { label: "CSV export", included: true },
      { label: "API access", included: false, note: "Enterprise only" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For teams or power users who need programmatic access and custom setup.",
    cta: "Contact us",
    ctaHref: "mailto:hello@flowr.app",
    highlighted: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "API access", included: true },
      { label: "Priority support", included: true },
      { label: "Custom onboarding", included: true },
      { label: "CSV export", included: true },
      { label: "Unlimited accounts", included: true },
      { label: "Unlimited categories", included: true },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Feature({ label, included, note }: PlanFeature) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span
        className={cn(
          "mt-0.5 shrink-0 text-base leading-none",
          included ? "text-primary" : "text-muted-foreground/50"
        )}
      >
        {included ? "✓" : "✗"}
      </span>
      <span className={cn(!included && "text-muted-foreground")}>
        {label}
        {note && (
          <span className="ml-1.5 text-xs text-muted-foreground">({note})</span>
        )}
      </span>
    </li>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 gap-6 transition-shadow",
        plan.highlighted
          ? "border-primary shadow-lg shadow-primary/10 bg-card"
          : "border-border bg-card"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-6">
          <Badge className="text-xs px-2.5 py-0.5 bg-primary text-primary-foreground">
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold font-display tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-sm text-muted-foreground">{plan.period}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* CTA */}
      <Button
        asChild
        variant={plan.highlighted ? "default" : "outline"}
        className="w-full"
      >
        <Link href={plan.ctaHref}>{plan.cta}</Link>
      </Button>

      {/* Features */}
      <ul className="space-y-2.5 pt-2 border-t">
        {plan.features.map((f) => (
          <Feature key={f.label} {...f} />
        ))}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="text-center px-6 pt-24 pb-16 max-w-2xl mx-auto space-y-4">
        <Badge variant="outline" className="text-xs tracking-wide">
          Simple, honest pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
          Your money, clearly.
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Start free. Upgrade when you need more accounts, history, or export.
          No surprises.
        </p>
      </section>

      {/* Cards */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* FAQ strip */}
      <section className="border-t px-6 py-16 max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold font-display text-center">
          Common questions
        </h2>
        <dl className="space-y-6">
          {[
            {
              q: "What happens when I hit the Free limit?",
              a: "You'll see a prompt to upgrade. Existing data is never deleted — you just can't add more until you upgrade or stay within limits.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel through the billing portal and you'll keep Pro access until the end of the current billing period, then revert to Free.",
            },
            {
              q: "What is 'months of history'?",
              a: "Free accounts can view and add transactions in the current month and 2 prior months. Pro removes this restriction entirely.",
            },
            {
              q: "Is my data safe if I downgrade?",
              a: "Yes. Your transactions, categories, and budgets are never deleted. On Free, older months just become read-only.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-1">
              <dt className="font-medium text-sm">{q}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}