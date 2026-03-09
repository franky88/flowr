import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST() {
  const data = await apiFetch<{ url: string }>(
    "/v1/subscription/checkout/",
    { method: "POST" }
  );

  return NextResponse.json(data);
}