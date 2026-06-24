import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEmailEvent } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const url = searchParams.get("url");
  const redirectUrl = url || "/";

  if (id) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    prisma.emailLog.findFirst({
      where: { messageId: id },
      select: { id: true, campaignId: true, status: true, to: true },
    }).then((log) => {
      if (log) {
        console.log(`[track:click] messageId=${id.slice(0, 8)}... to=${log.to} campaign=${log.campaignId || "none"} url=${redirectUrl.slice(0, 80)}`);
        return trackEmailEvent({
          messageId: id,
          eventType: "click",
          campaignId: log.campaignId || undefined,
          ip,
          userAgent,
          clickUrl: redirectUrl,
        });
      } else {
        console.log(`[track:click] messageId=${id.slice(0, 8)}... — no EmailLog found`);
      }
    }).catch((err) => {
      console.error(`[track:click] error for messageId=${id.slice(0, 8)}...:`, err);
    });
  }

  if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
    return Response.redirect(new URL(redirectUrl, request.url));
  }

  return Response.redirect(redirectUrl);
}
