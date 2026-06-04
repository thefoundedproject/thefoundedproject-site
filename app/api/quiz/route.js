import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, answers, profile } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Founded Project <quiz@thefoundedproject.com>',
        to: ['docthompsondacmdc@gmail.com'],
        reply_to: email,
        subject: `[Quiz Lead] ${profile?.title || 'New response'} — ${email}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#0F1B1F;color:#F5F0E8;">
            <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D8AB69;margin:0 0 8px;">The Founded Project — Quiz Lead</p>
            <h2 style="color:#F5F0E8;margin:0 0 24px;font-size:20px;">${profile?.title || 'New quiz response'}</h2>
            <p style="color:#D8AB69;font-size:13px;margin:0 0 4px;">Email</p>
            <p style="color:#F5F0E8;margin:0 0 20px;">${email}</p>
            <p style="color:#D8AB69;font-size:13px;margin:0 0 8px;">Answers</p>
            ${answers.map(a => `<p style="color:#F5F0E8;margin:0 0 4px;font-size:14px;"><strong style="color:#D8AB69;">${a.q}</strong><br>${a.a}</p>`).join('')}
          </div>
        `,
      }),
    });

    // Also send the user their result
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Founded Project <hello@thefoundedproject.com>',
        to: [email],
        subject: `Your Founded Project profile: ${profile?.title || 'Your results'}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#0F1B1F;color:#F5F0E8;">
            <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D8AB69;margin:0 0 16px;">The Founded Project</p>
            <h1 style="color:#F5F0E8;font-size:28px;font-weight:300;margin:0 0 8px;">${profile?.title || 'Your profile'}</h1>
            <p style="color:#F5F0E8;line-height:1.7;margin:0 0 24px;">${profile?.description || ''}</p>
            <p style="color:#F5F0E8;line-height:1.7;margin:0 0 24px;">${profile?.next || ''}</p>
            <a href="https://thefoundedproject.com" style="display:inline-block;background:#D8AB69;color:#0F1B1F;padding:14px 32px;text-decoration:none;font-weight:700;border-radius:4px;">Explore the Work</a>
          </div>
        `,
      }),
    }).catch(() => {}); // non-fatal

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
