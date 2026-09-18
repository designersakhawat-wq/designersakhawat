import nodemailer from "nodemailer";

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SmtpStatus {
  configured: boolean;
  host?: string;
  user?: string;
}

export function getSmtpStatus(): SmtpStatus {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return { configured: false };
  }
  return { configured: true, host, user };
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const status = getSmtpStatus();
  if (!status.configured) {
    console.warn("SMTP not configured — email not sent, but inquiry was saved.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}

export function buildInquiryEmailHtml(data: {
  name: string;
  email: string;
  service?: string;
  message: string;
  budget?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Inquiry</title></head>
<body style="font-family: sans-serif; background: #111; color: #eee; padding: 32px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid #2a2a2a;">
    <h1 style="color: #c8f000; margin-top: 0;">New Portfolio Inquiry</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0; color: #fff;"><a href="mailto:${escapeHtml(data.email)}" style="color: #c8f000;">${escapeHtml(data.email)}</a></td></tr>
      ${data.service ? `<tr><td style="padding: 8px 0; color: #888;">Service</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(data.service)}</td></tr>` : ""}
      ${data.budget ? `<tr><td style="padding: 8px 0; color: #888;">Budget</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(data.budget)}</td></tr>` : ""}
    </table>
    <h3 style="color: #c8f000; margin-top: 24px;">Message</h3>
    <p style="background: #111; padding: 16px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    <hr style="border-color: #2a2a2a; margin: 24px 0;">
    <p style="color: #666; font-size: 12px;">This inquiry was submitted via your portfolio website contact form.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
