import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, organization, reason, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Founded Project <contact@thefoundedproject.com>',
        to: ['docthompsondacmdc@gmail.com'],
        reply_to: email,
        subject: `[The Founded Project] ${reason || 'Inquiry'} from ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF7;color:#0F1B1F;">
            <div style="border-bottom:2px solid #D8AB69;padding-bottom:16px;margin-bottom:24px;">
              <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D8AB69;margin:0 0 4px;">The Founded Project</p>
              <h1 style="font-size:22px;font-weight:700;margin:0;color:#0F1B1F;">New Contact Inquiry</h1>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;width:120px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5D6A72;">From</td><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;color:#0F1B1F;">${name}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5D6A72;">Email</td><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;color:#0F1B1F;"><a href="mailto:${email}" style="color:#D8AB69;">${email}</a></td></tr>
              ${organization ? `<tr><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5D6A72;">Organization</td><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;color:#0F1B1F;">${organization}</td></tr>` : ''}
              ${reason ? `<tr><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5D6A72;">Reason</td><td style="padding:8px 0;border-bottom:1px solid #DDD2C2;color:#0F1B1F;">${reason}</td></tr>` : ''}
            </table>

            <div style="background:#F5F0E8;border-left:3px solid #D8AB69;padding:16px;border-radius:4px;">
              <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5D6A72;margin:0 0 8px;">Message</p>
              <p style="color:#0F1B1F;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
            </div>

            <p style="font-size:11px;color:#5D6A72;margin-top:32px;text-align:center;">
              Sent via thefoundedproject.com · Reply directly to this email to respond to ${name}.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
