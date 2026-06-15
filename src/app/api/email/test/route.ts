import { NextRequest } from "next/server";
import { getAuthUser, requireAdmin } from "@/lib/auth-middleware";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!requireAdmin(user)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const sent = await sendEmail(
      email,
      "Test email from CortexPrism",
      "<h1>Test</h1><p>This is a test email from CortexPrism. If you received this, email sending is configured correctly.</p>"
    );

    if (sent) {
      return Response.json({ success: true, message: "Test email sent" });
    }
    return Response.json({ error: "Email sending failed — check server logs for details" }, { status: 500 });
  } catch {
    return Response.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
