import { NextRequest } from "next/server";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { scanOrg, runOrgScan } from "@/lib/github-topic-scanner";

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { org } = body;

    if (!org) {
      return Response.json({ error: "Org name is required" }, { status: 400 });
    }

    const result = await scanOrg(org, user!.userId);

    runOrgScan(result.scanId, org, user!.userId).catch(err => {
      console.error("Org scan background error:", err);
    });

    return Response.json(result, { status: 202 });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : "Org scan failed",
    }, { status: 500 });
  }
}
