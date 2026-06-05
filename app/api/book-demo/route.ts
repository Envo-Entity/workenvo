import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid work email required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().max(100).optional(),
  teamSize: z.enum(["1-10", "11-50", "51-200", "200+"]).optional(),
  message: z.string().max(1000).optional(),
});

function confirmationHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Demo request received</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F9F7;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#16855B;padding:28px 40px;border-radius:12px 12px 0 0;">
          <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Workenvo</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 20px;font-size:22px;font-weight:600;color:#111827;line-height:1.35;">Hi ${name}, your request is confirmed.</p>
          <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">Thanks for reaching out. Someone from our team will be in touch within one business day to schedule a time that works for you.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F9F7;border-radius:8px;padding:20px;margin:0 0 24px;">
            <tr><td>
              <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111827;text-transform:uppercase;letter-spacing:0.06em;">What to expect in your demo</p>
              <p style="margin:0 0 8px;font-size:14px;color:#374151;padding-left:16px;">&#8212; A walkthrough tailored to your team size and challenges</p>
              <p style="margin:0 0 8px;font-size:14px;color:#374151;padding-left:16px;">&#8212; Live data from the Workenvo platform</p>
              <p style="margin:0;font-size:14px;color:#374151;padding-left:16px;">&#8212; Dedicated time for your questions</p>
            </td></tr>
          </table>

          <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">If you have any questions in the meantime, just reply to this email.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#ffffff;padding:0 40px 32px;border-radius:0 0 12px 12px;border-top:1px solid #E5E7EB;">
          <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;line-height:1.6;">
            Workenvo &middot; <a href="https://workenvo.com" style="color:#16855B;text-decoration:none;">workenvo.com</a><br>
            You are receiving this because you submitted a demo request on our website.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmationText(name: string) {
  return `Hi ${name},

Your demo request has been received. Someone from our team will be in touch within one business day to schedule a time that works for you.

What to expect in your demo:
- A walkthrough tailored to your team size and challenges
- Live data from the Workenvo platform
- Dedicated time for your questions

If you have any questions in the meantime, just reply to this email.

—
Workenvo
https://workenvo.com
`;
}

function notificationHtml(data: z.infer<typeof schema>) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company],
    ["Role", data.role || "—"],
    ["Team size", data.teamSize || "—"],
    ["Message", data.message || "—"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#6B7280;white-space:nowrap;vertical-align:top;border-bottom:1px solid #F3F4F6;">${label}</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-bottom:1px solid #F3F4F6;">${value}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New demo request</title>
</head>
<body style="margin:0;padding:0;background:#F5F9F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F9F7;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#111827;padding:24px 32px;border-radius:12px 12px 0 0;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.1em;">New demo request</p>
          <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">${data.name} &middot; ${data.company}</p>
        </td></tr>

        <!-- Table -->
        <tr><td style="background:#ffffff;border-radius:0 0 12px 12px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${rowsHtml}
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationText(data: z.infer<typeof schema>) {
  return `New demo request

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role || "—"}
Team size: ${data.teamSize || "—"}
Message: ${data.message || "—"}
`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    return Response.json({ error: message }, { status: 400 });
  }

  const data = parsed.data;
  const from = `Workenvo <${process.env.DEMO_FROM_EMAIL}>`;
  const notifyEmail = process.env.DEMO_NOTIFY_EMAIL!;

  const [confirmation, notification] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: [data.email],
      replyTo: process.env.DEMO_FROM_EMAIL,
      subject: "Demo request received — we'll be in touch shortly",
      html: confirmationHtml(data.name),
      text: confirmationText(data.name),
    }),
    resend.emails.send({
      from,
      to: [notifyEmail],
      replyTo: data.email,
      subject: `New demo request: ${data.name} at ${data.company}`,
      html: notificationHtml(data),
      text: notificationText(data),
    }),
  ]);

  if (
    confirmation.status === "rejected" ||
    (confirmation.status === "fulfilled" && confirmation.value.error)
  ) {
    console.error("Resend confirmation error:", confirmation);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  if (
    notification.status === "rejected" ||
    (notification.status === "fulfilled" && notification.value.error)
  ) {
    console.error("Resend notification error:", notification);
  }

  return Response.json({ success: true });
}
