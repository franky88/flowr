import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
  });
  const data = await response.json();

  // Filter to free vision-capable models only
  const freeVision = data.data
    ?.filter(
      (m: any) =>
        m.id.includes(":free") &&
        (m.architecture?.modality?.includes("image") ||
          m.architecture?.input_modalities?.includes("image")),
    )
    .map((m: any) => m.id);

  return NextResponse.json({ freeVision });
}
