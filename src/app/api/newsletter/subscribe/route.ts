import { NextRequest } from "next/server";
import zod from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, renderNewsletterVerificationEmail, hashVerificationToken } from "@/lib/email";
import crypto from "crypto";

const SubscribeSchema = zod.object({
  email: zod.string().email().max(255),
});

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const COOLDOWN_MS = 5 * 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

const emailCooldownMap = new Map<string, number>();
function isOnCooldown(email: string): boolean {
  const last = emailCooldownMap.get(email);
  if (last && Date.now() - last < COOLDOWN_MS) return true;
  return false;
}

function setCooldown(email: string): void {
  emailCooldownMap.set(email, Date.now());
}

function getRequestIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = SubscribeSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const ip = getRequestIp(request);
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    if (isOnCooldown(normalizedEmail)) {
      return Response.json({ message: "Verification email already sent — check your inbox" });
    }

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === "active") {
        return Response.json({ message: "Already subscribed" });
      }
      if (existing.status === "unsubscribed") {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenHash = hashVerificationToken(verificationToken);
        await prisma.newsletterSubscription.update({
          where: { email: normalizedEmail },
          data: { status: "pending", verificationTokenHash, unsubscribeTokenHash: null, unsubscribedAt: null },
        });
        setCooldown(normalizedEmail);
        await sendEmail(
          normalizedEmail,
          renderNewsletterVerificationEmail(normalizedEmail, verificationToken).subject,
          renderNewsletterVerificationEmail(normalizedEmail, verificationToken).html,
          undefined,
          { type: "newsletter_verification" }
        );
        return Response.json({ message: "Verification email sent" });
      }
      if (existing.status === "pending") {
        return Response.json({ message: "Verification email already sent — check your inbox" });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = hashVerificationToken(verificationToken);
    await prisma.newsletterSubscription.create({
      data: { email: normalizedEmail, status: "pending", verificationTokenHash },
    });

    setCooldown(normalizedEmail);
    await sendEmail(
      normalizedEmail,
      renderNewsletterVerificationEmail(normalizedEmail, verificationToken).subject,
      renderNewsletterVerificationEmail(normalizedEmail, verificationToken).html,
      undefined,
      { type: "newsletter_verification" }
    );

    return Response.json({ message: "Verification email sent" }, { status: 201 });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
