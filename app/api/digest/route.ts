import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { IntelligenceReport } from "@/lib/api/intelligence";
import { formatDate } from "@/lib/formatDate";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const body: {
    intelligence: IntelligenceReport;
    kpis: {
      income: string;
      expense: string;
      net: string;
      closingBalance: string;
    };
    previousMonth: string;
    deltaIncomePct: string | null;
    deltaExpensePct: string | null;
  } = await req.json();

  const {
    intelligence: d,
    kpis,
    previousMonth,
    deltaIncomePct,
    deltaExpensePct,
  } = body;

  const criticalRisks = d.budgetRisks.filter((r) => r.riskLevel === "critical");
  const warningRisks = d.budgetRisks.filter((r) => r.riskLevel === "warning");
  const exceededBudgets = d.budgetRisks.filter((r) => r.isCurrentlyExceeded);

  const prompt = `You are a personal finance assistant for a Filipino cashflow tracker app called Flowr.
Write a concise, friendly 2-3 sentence financial digest for the month ${formatDate(d.month)}.
Be specific — use actual numbers. Use ₱ for currency. Be direct, not overly positive.
Do NOT use bullet points or headers. Plain prose only.

Data:
- Income: ₱${Number(kpis.income).toLocaleString("en-PH")}
- Expenses: ₱${Number(kpis.expense).toLocaleString("en-PH")}
- Net: ₱${Number(kpis.net).toLocaleString("en-PH")}
- Closing balance: ₱${Number(kpis.closingBalance).toLocaleString("en-PH")}
- Forecast end-of-month balance: ₱${Number(d.forecastBalance).toLocaleString("en-PH")}
- Daily burn rate: ₱${Number(d.dailyBurnRate).toLocaleString("en-PH")}/day
- Days remaining: ${d.daysRemaining}
- Days until zero: ${d.daysUntilZero ?? "N/A"}
- Income change vs ${previousMonth}: ${deltaIncomePct ? `${deltaIncomePct}%` : "no data"}
- Expense change vs ${previousMonth}: ${deltaExpensePct ? `${deltaExpensePct}%` : "no data"}
- Income volatility: ${d.incomeVolatility.label}
- Budgets currently exceeded: ${exceededBudgets.map((r) => r.categoryName).join(", ") || "none"}
- Budget warnings: ${warningRisks.map((r) => r.categoryName).join(", ") || "none"}
- Critical budget risks: ${criticalRisks.map((r) => `${r.categoryName} (projected overrun: ₱${Number(r.projectedOverrun).toLocaleString("en-PH")})`).join(", ") || "none"}

Use **double asterisks** around key numbers and category names. Write the digest now:`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content ?? "";
    return NextResponse.json({ digest: text });
  } catch (err: any) {
    console.error("Digest API error:", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
