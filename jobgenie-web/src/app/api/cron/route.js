import { NextResponse } from 'next/server';

export async function GET(req) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Call your existing /send-daily-email route internally
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/send-daily-email`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`, // optional, if you want protection there too
      },
    });

    const data = await res.json();
    return NextResponse.json({ triggered: true, data });
  } catch (err) {
    console.error("Cron trigger failed:", err);
    return NextResponse.json({ success: false, message: "Cron trigger failed" }, { status: 500 });
  }
}
