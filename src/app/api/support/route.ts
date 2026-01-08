import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@entrestate.com';

const payloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  topic: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_API_KEY || !FROM_EMAIL) {
      return NextResponse.json({ error: 'Support email is not configured' }, { status: 500 });
    }

    const payload = payloadSchema.parse(await req.json());
    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: `Entrestate Support <${FROM_EMAIL}>`,
      to: SUPPORT_EMAIL,
      subject: `Support request - ${payload.topic}`,
      replyTo: payload.email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 12px;">New Support Request</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Topic:</strong> ${payload.topic}</p>
          <p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    console.error('[support] error', error);
    return NextResponse.json({ error: 'Failed to send support request' }, { status: 500 });
  }
}
