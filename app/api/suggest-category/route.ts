import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Category {
  id: string;
  name: string;
  level: number;
}

function buildFullNames(
  categories: Category[],
): { id: string; name: string; fullName: string }[] {
  const result: { id: string; name: string; fullName: string }[] = [];
  const parentStack: string[] = [];

  for (const cat of categories) {
    parentStack.splice(cat.level);
    parentStack.push(cat.name);
    result.push({
      id: cat.id,
      name: cat.name,
      fullName: parentStack.join(" > "),
    });
  }

  return result;
}

export async function POST(req: NextRequest) {
  const { note, categories, type } = await req.json();

  if (!note?.trim() || !categories?.length) {
    return NextResponse.json({ categoryId: null });
  }

  const withFullNames = buildFullNames(categories);

  const prompt = `You are a transaction categorizer. Match the note to the best category.

Transaction type: ${type}
Transaction note: "${note}"

Available categories:
${withFullNames.map((c) => `"${c.fullName}"`).join("\n")}

Reply with ONLY the category name exactly as written above. No explanation. No punctuation. Just the name.
If nothing fits, reply: none`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 20,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content?.trim() ?? "";
    console.log("Groq raw response:", raw);

    if (!raw || raw.toLowerCase() === "none") {
      return NextResponse.json({ categoryId: null });
    }

    // Match by fullName first, then fallback to partial name match
    const exact = withFullNames.find(
      (c) => c.fullName.toLowerCase() === raw.toLowerCase(),
    );
    if (exact) return NextResponse.json({ categoryId: exact.id });

    const partial = withFullNames.find(
      (c) =>
        raw.toLowerCase().includes(c.name.toLowerCase()) ||
        c.fullName.toLowerCase().includes(raw.toLowerCase()),
    );

    return NextResponse.json({ categoryId: partial?.id ?? null });
  } catch (err: any) {
    console.error("Suggest category error:", err?.message);
    return NextResponse.json({ categoryId: null });
  }
}
