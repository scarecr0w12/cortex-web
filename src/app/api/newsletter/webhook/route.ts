import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEmailEvent } from "@/lib/email";

function parseCampaignId(event: Record<string, unknown>): string | undefined {
  if (typeof event.campaign_id === "string") return event.campaign_id;
  try {
    const args = typeof event.custom_args === "string"
      ? JSON.parse(event.custom_args)
      : event.custom_args;
    return typeof (args as Record<string, unknown>)?.campaign_id === "string"
      ? (args as Record<string, unknown>).campaign_id as string
      : undefined;
  } catch {
    return undefined;
  }
}

function parseSendgridMessageId(event: Record<string, unknown>): string | undefined {
  if (typeof event.sg_message_id === "string") return event.sg_message_id;
  return undefined;
}

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();

  try {
    const rawBody = await request.text();
    let events: unknown;
    try {
      events = JSON.parse(rawBody);
    } catch {
      console.log(`[sendgrid:webhook] ${receivedAt} — received non-JSON body (${rawBody.length} bytes): ${rawBody.slice(0, 200)}`);
      return Response.json({ success: true });
    }

    const eventList = Array.isArray(events) ? events : [events];

    console.log(`[sendgrid:webhook] ${receivedAt} — received ${eventList.length} event(s)`);

    let matched = 0;
    let unmatched = 0;
    let processed = 0;
    let errors = 0;
    const typeSummary: Record<string, number> = {};

    for (const event of eventList) {
      const eventType = (event as Record<string, unknown>).event as string;
      const campaignId = parseCampaignId(event as Record<string, unknown>);
      const email = typeof (event as Record<string, unknown>).email === "string"
        ? ((event as Record<string, unknown>).email as string).toLowerCase().trim()
        : null;
      const sgMessageId = parseSendgridMessageId(event as Record<string, unknown>);
      const ip = typeof (event as Record<string, unknown>).ip === "string"
        ? (event as Record<string, unknown>).ip as string
        : undefined;
      const userAgent = typeof (event as Record<string, unknown>).useragent === "string"
        ? (event as Record<string, unknown>).useragent as string
        : undefined;
      const url = typeof (event as Record<string, unknown>).url === "string"
        ? (event as Record<string, unknown>).url as string
        : undefined;

      typeSummary[eventType] = (typeSummary[eventType] || 0) + 1;

      try {
        if (eventType === "unsubscribe" || eventType === "spamreport" || eventType === "bounce" || eventType === "blocked") {
          if (email) {
            const subResult = await prisma.newsletterSubscription.updateMany({
              where: { email },
              data: { status: "unsubscribed", unsubscribedAt: new Date() },
            });
            if (subResult.count > 0) {
              console.log(`[sendgrid:webhook] ${eventType} — unsubscribed ${email} (matched ${subResult.count} subscriber(s))`);
            }
          }
        }

        if (sgMessageId) {
          const logBySg = await prisma.emailLog.findFirst({
            where: { sendgridMessageId: sgMessageId },
            select: { id: true, messageId: true, to: true },
          });

          if (logBySg) {
            console.log(`[sendgrid:webhook] ${eventType} — matched EmailLog by sendgridMessageId (to: ${logBySg.to}, campaign: ${campaignId || "none"})`);
            await trackEmailEvent({
              messageId: logBySg.messageId || undefined,
              eventType,
              campaignId,
              ip,
              userAgent,
              clickUrl: url,
            });
            matched++;
            processed++;
          } else {
            console.log(`[sendgrid:webhook] ${eventType} — no EmailLog found for sendgridMessageId: ${sgMessageId} (email: ${email || "unknown"})`);
            unmatched++;

            if (email && campaignId) {
              console.log(`[sendgrid:webhook] ${eventType} — falling back to email+campaign lookup (email: ${email}, campaign: ${campaignId})`);
              await trackEmailEvent({
                to: email,
                campaignId,
                eventType,
                ip,
                userAgent,
                clickUrl: url,
              });
              processed++;
            }
          }
        } else if (email && campaignId) {
          console.log(`[sendgrid:webhook] ${eventType} — no sgMessageId, using email+campaign lookup (email: ${email}, campaign: ${campaignId})`);
          await trackEmailEvent({
            to: email,
            campaignId,
            eventType,
            ip,
            userAgent,
            clickUrl: url,
          });
          processed++;
        } else {
          console.log(`[sendgrid:webhook] ${eventType} — insufficient data to process (email: ${email || "none"}, campaign: ${campaignId || "none"}, sgMessageId: ${sgMessageId || "none"})`);
          unmatched++;
        }
      } catch (eventError) {
        errors++;
        console.error(`[sendgrid:webhook] ${eventType} — error processing event:`, eventError);
      }
    }

    console.log(
      `[sendgrid:webhook] ${receivedAt} — done: ${processed} processed, ${matched} matched by sgMessageId, ${unmatched} unmatched, ${errors} errors | ` +
      `types: ${Object.entries(typeSummary).map(([k, v]) => `${k}×${v}`).join(", ")}`
    );

    return Response.json({ success: true, processed, matched, unmatched, errors });
  } catch (error) {
    console.error(`[sendgrid:webhook] ${receivedAt} — FATAL:`, error);
    return Response.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
