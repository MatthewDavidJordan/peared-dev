// api/email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the schema for the email request
const EmailRequestSchema = z.object({
  type: z.string(), // Type of email (e.g., 'meetingConfirmation')
  to: z.string().email(),
  data: z.record(z.any()), // Additional data required for the email template
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validationResult = EmailRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email request', details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { type, to, data } = validationResult.data;

    // Determine the email content based on the type
    let subject: string;
    let htmlContent: string;

    switch (type) {
      case 'meetingConfirmation':
        subject = 'Meeting Confirmation';
        htmlContent = `
          <p>Dear ${data.studentName},</p>
          <p>You have scheduled a meeting with ${data.advisorName} on ${data.formattedStartTime}.</p>
          <p>Best regards,<br/>Your Company</p>
        `;
        break;

      // Add more cases for different email types

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // Send the email using Resend
    await resend.emails.send({
      from: 'Your Service <no-reply@peared.org>',
      to,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
