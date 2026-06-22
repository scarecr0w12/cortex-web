import sgMail from "@sendgrid/mail";
import crypto from "crypto";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@cortexprism.io";
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "CortexPrism";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cortexprism.io";
const NEWSLETTER_UNSUBSCRIBE_SECRET = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.JWT_SECRET || "";

const isConfigured = !!SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function buildEmail(to: string, subject: string, html: string) {
  return { to, from: { email: FROM_EMAIL, name: FROM_NAME }, subject, html };
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!isConfigured) {
    console.log(`[email] Skipping email to ${to}: "${subject}" (SendGrid not configured)`);
    return false;
  }
  try {
    await sgMail.send(buildEmail(to, subject, html));
    return true;
  } catch {
    console.error(`[email] Failed to send email to ${to}: "${subject}"`);
    return false;
  }
}

function wrapTemplate(title: string, bodyHtml: string, cta?: { text: string; url: string }, footerHtml?: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f">
    <tr><td align="center" style="padding:40px 16px">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
        <tr><td style="padding:0 0 24px 0;text-align:center">
          <span style="font-size:22px;font-weight:700;color:#e2e2ea;letter-spacing:-0.5px">CortexPrism</span>
        </td></tr>
        <tr><td style="background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:32px">
          <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#e2e2ea">${escapeHtml(title)}</h1>
          <div style="font-size:14px;line-height:1.6;color:#9090a8">${bodyHtml}</div>
          ${cta ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0"><tr><td><a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:500;color:#fff;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:8px;text-decoration:none">${escapeHtml(cta.text)}</a></td></tr></table>` : ""}
        </td></tr>
        <tr><td style="padding:24px 16px 0;text-align:center;font-size:12px;color:#55556a">
          <p style="margin:0 0 4px 0">CortexPrism — Open-Source Agentic Harness</p>
          <p style="margin:0"><a href="${SITE_URL}" style="color:#6366f1;text-decoration:none">${SITE_URL}</a></p>
          ${footerHtml || ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function generateUnsubscribeToken(email: string): string {
  if (!NEWSLETTER_UNSUBSCRIBE_SECRET) {
    throw new Error("NEWSLETTER_UNSUBSCRIBE_SECRET or JWT_SECRET must be set to generate unsubscribe tokens");
  }
  return crypto.createHmac("sha256", NEWSLETTER_UNSUBSCRIBE_SECRET).update(`unsub:${email}`).digest("hex").slice(0, 32);
}

export function hashVerificationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/ on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/ on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "");
}

export function renderSubmissionApprovedEmail(username: string, itemType: string, itemName: string, itemUrl: string) {
  const safeUsername = escapeHtml(username);
  const safeItemName = escapeHtml(itemName);
  const safeItemUrl = escapeHtml(itemUrl);
  const safeType = escapeHtml(itemType);
  return {
    subject: `Your ${safeType} "${safeItemName}" has been approved`,
    html: wrapTemplate(
      "Submission Approved",
      `<p>Hi ${safeUsername},</p><p>Your ${safeType} <strong style="color:#e2e2ea">${safeItemName}</strong> has been reviewed and approved. It's now live in the CortexPrism marketplace.</p>`,
      { text: `View ${safeType === "plugin" ? "Plugin" : "Agent"}`, url: safeItemUrl }
    ),
  };
}

export function renderSubmissionRejectedEmail(username: string, itemType: string, itemName: string, notes?: string) {
  const safeUsername = escapeHtml(username);
  const safeItemName = escapeHtml(itemName);
  const safeType = escapeHtml(itemType);
  const safeNotes = notes ? escapeHtml(notes) : null;
  return {
    subject: `Your ${safeType} "${safeItemName}" submission update`,
    html: wrapTemplate(
      "Submission Update",
      `<p>Hi ${safeUsername},</p><p>Your ${safeType} <strong style="color:#e2e2ea">${safeItemName}</strong> has been reviewed and was not approved at this time.</p>${safeNotes ? `<div style="margin-top:12px;padding:12px;background:#0a0a0f;border-radius:8px;border:1px solid rgba(255,255,255,0.07)"><p style="margin:0;font-size:13px;color:#9090a8">${safeNotes}</p></div>` : ""}<p style="font-size:13px;margin-top:16px">You can review the feedback and resubmit an updated version.</p>`,
      { text: "View Submission", url: `${SITE_URL}/dashboard` }
    ),
  };
}

export function renderWelcomeEmail(username: string) {
  const safeUsername = escapeHtml(username);
  return {
    subject: "Welcome to CortexPrism",
    html: wrapTemplate(
      "Welcome to CortexPrism",
      `<p>Hi ${safeUsername},</p><p>Welcome to CortexPrism! You now have access to the full marketplace where you can discover and publish plugins and agent configs.</p><p>Here are some things you can do:</p><ul style="padding-left:20px;margin:12px 0;font-size:14px;line-height:1.8;color:#9090a8"><li>Browse the <a href="${SITE_URL}/marketplace" style="color:#6366f1">marketplace</a> for plugins and agents</li><li><a href="${SITE_URL}/marketplace/publish/plugin" style="color:#6366f1">Publish your own plugin</a></li><li>Check out the <a href="${SITE_URL}/docs" style="color:#6366f1">documentation</a> to learn more</li></ul>`,
      { text: "Get Started", url: `${SITE_URL}/getting-started` }
    ),
  };
}

export function renderNewsletterVerificationEmail(email: string, token: string) {
  const safeEmail = escapeHtml(email);
  const verifyUrl = `${SITE_URL}/api/newsletter/verify?token=${encodeURIComponent(token)}`;
  return {
    subject: "Confirm your CortexPrism newsletter subscription",
    html: wrapTemplate(
      "Confirm your subscription",
      `<p>Hi there,</p><p>Please confirm your newsletter subscription by clicking the button below:</p><p style="font-size:13px;color:#55556a">This email was requested for <strong style="color:#e2e2ea">${safeEmail}</strong>. If you didn't request this, you can safely ignore this email.</p>`,
      { text: "Confirm Subscription", url: verifyUrl }
    ),
  };
}

export function renderNewsletterCampaignEmail(subject: string, content: string, unsubscribeToken: string) {
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  return {
    subject,
    html: wrapTemplate(
      subject,
      sanitizeHtml(content),
      undefined,
      `<p style="margin:8px 0 0 0;font-size:11px"><a href="${unsubscribeUrl}" style="color:#55556a;text-decoration:underline">Unsubscribe</a> from the CortexPrism newsletter</p>`
    ),
  };
}

export async function sendBulkEmails(
  recipients: { email: string; unsubscribeToken: string }[],
  subject: string,
  content: string,
  onProgress?: (sent: number, total: number) => void
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const { email: to, unsubscribeToken } = recipients[i];
    const emailHtml = renderNewsletterCampaignEmail(subject, content, unsubscribeToken).html;
    const success = await sendEmail(to, subject, emailHtml);
    if (success) {
      sent++;
    } else {
      failed++;
    }
    onProgress?.(sent + failed, recipients.length);
    if (i < recipients.length - 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return { sent, failed };
}
