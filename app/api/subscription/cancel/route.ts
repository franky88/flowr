import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/api"

export async function POST() {
  const data = await apiFetch("/v1/subscription/cancel/", { method: "POST" })
  return NextResponse.json(data)
}