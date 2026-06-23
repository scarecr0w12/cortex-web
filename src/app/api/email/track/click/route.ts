import { NextRequest } from "next/server";
import { updateEmailStatus } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const url = searchParams.get("url");

  if (id) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    updateEmailStatus({
      messageId: id,
      status: "clicked",
      ip,
      userAgent,
      clickUrl: url || undefined,
    }).catch(() => {});
  }

  const redirectUrl = url || "/";

  if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
    return Response.redirect(new URL(redirectUrl, request.url));
  }

  return Response.redirect(redirectUrl);
}
