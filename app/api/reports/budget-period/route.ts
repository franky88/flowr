import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBudgetPeriodReports } from "@/lib/api/reports";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const workspaceId = searchParams.get("workspaceId");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  if (!workspaceId || !dateFrom || !dateTo) {
    return NextResponse.json(
      { error: "Missing required params: workspaceId, date_from, date_to" },
      { status: 400 }
    );
  }

  try {
    const data = await getBudgetPeriodReports(workspaceId, dateFrom, dateTo);
    return NextResponse.json(data);
  } catch (err: any) {
    const message = err?.message ?? "Internal server error";
    const status = message.includes("401") ? 401
                 : message.includes("403") ? 403
                 : message.includes("404") ? 404
                 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}