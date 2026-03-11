import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const accountId = searchParams.get("accountId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId required" },
      { status: 400 },
    );
  }

  const qs = new URLSearchParams();
  if (accountId) qs.set("accountId", accountId);

  const data = await apiFetch(
    `/v1/workspaces/${workspaceId}/reports/spending-history/?${qs}`,
  );

  return NextResponse.json(data);
}
