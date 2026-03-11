import { NextRequest, NextResponse } from "next/server";

interface Category {
  id: string;
  name: string;
  level: number;
}

function buildFullNames(categories: Category[]) {
  const result: { id: string; name: string; fullName: string }[] = [];
  const stack: string[] = [];
  for (const cat of categories) {
    stack.splice(cat.level);
    stack.push(cat.name);
    result.push({ id: cat.id, name: cat.name, fullName: stack.join(" > ") });
  }
  return result;
}

const MODELS = [
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
];

async function callOpenRouter(
  model: string,
  imageBase64: string,
  mimeType: string,
  prompt: string,
) {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Flowr",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });
}

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType, categories } = await req.json();

  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const withFullNames = buildFullNames(categories ?? []);
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are a receipt/transaction scanner for a Filipino personal finance app.
Extract transaction details from this image. It may be a GCash screenshot, Maya transfer, bank receipt, or physical receipt photo.

Today's date: ${today}

Available categories:
${withFullNames.map((c) => `"${c.fullName}"`).join("\n")}

Return ONLY a JSON object with these exact fields, no explanation, no markdown:
{
  "amount": <number, required — the total/amount paid>,
  "date": "<YYYY-MM-DD, use today if not visible>",
  "type": "<INCOME or EXPENSE>",
  "note": "<merchant name or short description, max 60 chars>",
  "category_hint": "<best matching category full name from the list, or null>"
}

Rules:
- For GCash/Maya send money → type is EXPENSE
- For GCash/Maya receive money → type is INCOME
- For store receipts → type is EXPENSE
- amount must be a plain number, no currency symbols
- If you cannot read the image clearly, still return best-effort values`;

  try {
    let successResponse: Response | null = null;
    let lastError = "";

    for (const model of MODELS) {
      const res = await callOpenRouter(model, imageBase64, mimeType, prompt);
      if (res.ok) {
        successResponse = res;
        break;
      }
      const err = await res.json();
      lastError = err?.error?.message ?? `${res.status}`;
      console.warn(`Model ${model} failed: ${lastError}`);
    }

    if (!successResponse) {
      console.error("All models failed. Last error:", lastError);
      return NextResponse.json(
        { error: "All vision models unavailable. Try again later." },
        { status: 503 },
      );
    }

    const data = await successResponse.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    console.log("OCR raw response:", raw);

    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    let categoryId: string | null = null;
    if (parsed.category_hint && withFullNames.length) {
      const hint = parsed.category_hint.toLowerCase();
      const exact = withFullNames.find(
        (c) => c.fullName.toLowerCase() === hint,
      );
      const partial = withFullNames.find(
        (c) =>
          hint.includes(c.name.toLowerCase()) ||
          c.fullName.toLowerCase().includes(hint),
      );
      categoryId = exact?.id ?? partial?.id ?? null;
    }

    return NextResponse.json({
      amount: String(parsed.amount ?? ""),
      date: parsed.date ?? today,
      type: parsed.type === "INCOME" ? "income" : "expense",
      note: parsed.note ?? "",
      categoryId,
    });
  } catch (err: any) {
    console.error("OCR error:", err?.message);
    return NextResponse.json(
      { error: "Failed to parse receipt" },
      { status: 500 },
    );
  }
}
