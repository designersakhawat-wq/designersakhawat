import { NextRequest, NextResponse } from "next/server";
import { execute, query, queryOne } from "@/lib/db";
import { hashIp, checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { sendMail, buildInquiryEmailHtml } from "@/lib/mail";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  service: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  budget: z.string().max(100).optional(),
  honeypot: z.string().max(0, "Bot detected").optional(), // honeypot field
});

/** POST /api/contact */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const maxRequests = parseInt(process.env.RATE_LIMIT_CONTACT || "3");

  const rateCheck = checkRateLimit(`contact:${ip}`, {
    maxRequests,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Validate
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, service, message, budget } = parsed.data;
    const ipHash = await hashIp(ip);

    // Save inquiry
    const result = await execute(
      "INSERT INTO inquiries (name, email, service, message, budget, ip_hash) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, service || null, message, budget || null, ipHash]
    );

    // Send email notification (non-blocking - inquiry already saved)
    const notifyEmail = process.env.NOTIFICATION_EMAIL || "designersakhawat86@gmail.com";
    const emailSent = await sendMail({
      to: notifyEmail,
      subject: `New Portfolio Inquiry from ${name}`,
      html: buildInquiryEmailHtml({ name, email, service, message, budget }),
      text: `New inquiry from ${name} (${email})\n\nService: ${service || "Not specified"}\nBudget: ${budget || "Not specified"}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({
      success: true,
      id: result.insertId,
      emailSent,
      message: "Your message has been received. I'll get back to you soon!",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to submit. Please try contacting me directly via WhatsApp or email." },
      { status: 500 }
    );
  }
}
