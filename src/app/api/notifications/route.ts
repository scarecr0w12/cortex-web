import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { getNotifications, markAllNotificationsRead } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  const result = await getNotifications(user.userId, page, limit);
  return Response.json(result);
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  await markAllNotificationsRead(user.userId);
  return Response.json({ success: true });
}
