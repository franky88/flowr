import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface SpendingRow {
  categoryId: string;
  categoryName: string;
  months: { month: string; spent: number }[];
  average: number;
}

export async function POST(req: NextRequest) {
  const { spendingHistory, incomeBase, targetMonth } = await req.json();

  if (!spendingHistory?.length) {
    return NextResponse.json({ suggestions: [] });
  }

  const prompt = `You are a personal finance budget advisor for a Filipino app called Flowr.
Analyze spending history and suggest realistic monthly budgets.

Target month: ${targetMonth}
Monthly income base: ₱${Number(incomeBase ?? 0).toLocaleString("en-PH")}

Spending history per category:
${spendingHistory
  .map(
    (r: SpendingRow) =>
      `- ID="${r.categoryId}" NAME="${r.categoryName}": avg ₱${r.average.toLocaleString("en-PH")} (${r.months.map((m) => `${m.month}: ₱${m.spent.toLocaleString("en-PH")}`).join(", ")})`,
  )
  .join("\n")}

CRITICAL: The categoryId in your response MUST be copied exactly from the ID="..." values above.
Do NOT invent category IDs. Do NOT use category names as IDs.

Rules:
- Suggest rule_type "percent" only if income base > 0 AND the category is variable (food, groceries, entertainment)
- Suggest rule_type "fixed" for utilities, rent, subscriptions, loans
- For "percent": value is a whole number percentage (e.g. 20 means 20%)
- For "fixed": value is the peso amount
- Be slightly conservative — suggest 5-10% less than the average
- Round fixed values to nearest 100 pesos
- Round percent values to nearest whole number

Return ONLY a JSON array, no explanation, no markdown:
[
  { "categoryId": "<exact ID from above>", "categoryName": "<name>", "rule_type": "fixed"|"percent", "value": <number>, "reasoning": "<one short sentence>" }
]`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content?.trim() ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(clean);

    // ← ADD THIS BLOCK HERE:
    const validIds = new Set(
      spendingHistory.map((r: SpendingRow) => r.categoryId),
    );
    const validated = suggestions.filter((s: any) => {
      if (!validIds.has(s.categoryId)) {
        console.warn(
          `AI returned invalid categoryId: ${s.categoryId} — dropped`,
        );
        return false;
      }
      return true;
    });

    // ← REPLACE the old return:
    return NextResponse.json({ suggestions: validated });
  } catch (err: any) {
    console.error("Budget suggestion error:", err?.message);
    return NextResponse.json({ suggestions: [] });
  }
}
