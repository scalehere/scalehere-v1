import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    // Basic validation — phone is optional
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Send notification email via Resend (existing behavior)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "tools@scalehere.com",
      subject: `New inquiry from ${name} — Scale SD Website`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        ``,
        `Message:`,
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    // Forward submission to GHL Inbound Webhook (Phase 2b).
    // Wrapped in its own try/catch so a GHL failure does not break the
    // user-facing success path — Resend already succeeded above.
    if (process.env.GHL_WEBHOOK_URL) {
      try {
        const ghlRes = await fetch(process.env.GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, message }),
        });
        if (!ghlRes.ok) {
          console.error(
            "[contact route] GHL webhook returned non-OK:",
            ghlRes.status,
            await ghlRes.text()
          );
        }
      } catch (ghlErr) {
        console.error("[contact route] GHL webhook error:", ghlErr);
      }
    } else {
      console.warn(
        "[contact route] GHL_WEBHOOK_URL not set — skipping GHL forward"
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact route] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}