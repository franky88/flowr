import { NextRequest, NextResponse } from "next/server";
import { getBudgetPeriodReports } from "@/lib/api/reports";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const workspaceId = searchParams.get("workspaceId");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  if (!workspaceId || !dateFrom || !dateTo) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const data = await getBudgetPeriodReports(workspaceId, dateFrom, dateTo);
  console.log("Budget Period Report:", data);
  return NextResponse.json(data);
}