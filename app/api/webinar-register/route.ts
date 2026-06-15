import { z } from "zod";

const WEBINAR_EVENT_TYPE_ID = 332832;
const WEBINAR_START = "2026-12-31T12:00:00Z"; // Dec 31 2026, 12:00pm London (UTC+0)

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required").max(200),
  company: z.string().max(200).optional(),
  timezone: z.string().default("UTC"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, company, timezone } = parsed.data;

  const calRes = await fetch("https://api.cal.eu/v2/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CAL_API_KEY}`,
      "Content-Type": "application/json",
      "cal-api-version": "2024-08-13",
    },
    body: JSON.stringify({
      eventTypeId: WEBINAR_EVENT_TYPE_ID,
      start: WEBINAR_START,
      attendee: { name, email, timeZone: timezone },
      metadata: { company: company ?? "" },
    }),
  });

  const calData = await calRes.json();

  if (!calRes.ok) {
    console.error("Cal.eu booking error:", calData);
    return Response.json(
      { error: calData?.error?.message ?? "Registration failed. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
