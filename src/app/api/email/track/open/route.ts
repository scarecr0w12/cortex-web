import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEmailEvent } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    prisma.emailLog.findFirst({
      where: { messageId: id },
      select: { id: true, campaignId: true, status: true, to: true },
    }).then((log) => {
      if (log) {
        console.log(`[track:open] messageId=${id.slice(0, 8)}... to=${log.to} campaign=${log.campaignId || "none"}`);
        return trackEmailEvent({
          messageId: id,
          eventType: "open",
          campaignId: log.campaignId || undefined,
          ip,
          userAgent,
        });
      } else {
        console.log(`[track:open] messageId=${id.slice(0, 8)}... — no EmailLog found`);
      }
    }).catch((err) => {
      console.error(`[track:open] error for messageId=${id.slice(0, 8)}...:`, err);
    });
  }

  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new Response(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
