import { NextResponse } from 'next/server'

/**
 * POST /api/subscribe
 *
 * Captures an email address for The Founded Project mailing list.
 *
 * If RESEND_API_KEY is set, the endpoint forwards the new subscriber to
 * docthompsondacmdc@gmail.com so Dr. Thompson can add them to whichever
 * mailing-list service he chooses (ConvertKit, Buttondown, plain Gmail, etc.).
 *
 * If RESEND_API_KEY is NOT set, the endpoint still returns success and logs
 * the subscriber to the server log so no signup is silently dropped. Wire
 * Resend in Railway → Variables to enable real notifications.
 *
 * Copyright 2026 Dr. Stephen Thompson / The Founded Project
 */
export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Valid email required.' }, { status: 400 })
    }

    const ts = new Date().toISOString()
    // Always log the signup so it's never silently dropped.
    console.log(`[subscribe] ${ts} ${email}`)

    if (!process.env.RESEND_API_KEY) {
      // Resend not configured yet. Return ok so the user sees confirmation;
      // server log is the durable record until Resend (or another service) is wired.
      return NextResponse.json({ ok: true, mode: 'logged-only' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Founded Project <noreply@thefoundedproject.com>',
        to: ['docthompsondacmdc@gmail.com'],
        subject: `New mailing-list signup: ${email}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;padding:24px;background:#F5F0E8;color:#0F1B1F;">
            <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#D8AB69;margin:0 0 6px;">The Founded Project</p>
            <h1 style="font-size:22px;font-weight:300;margin:0 0 16px;color:#0F1B1F;">New mailing-list signup</h1>
            <p style="font-size:16px;line-height:1.6;margin:0 0 8px;">${email}</p>
            <p style="font-size:13px;color:rgba(15,27,31,0.6);margin:8px 0 0;">Captured ${ts} from thefoundedproject.com/#subscribe</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[subscribe] Resend error:', err)
      return NextResponse.json({ ok: true, mode: 'logged-fallback' })
    }

    return NextResponse.json({ ok: true, mode: 'forwarded' })
  } catch (err) {
    console.error('[subscribe] error:', err)
    // Return 200 anyway so the UX flow completes — we don't want to lose signups to bugs.
    return NextResponse.json({ ok: true, mode: 'error-fallback' })
  }
}
