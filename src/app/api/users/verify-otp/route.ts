// /app/api/users/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { createStudent, verifyUserOtp } from '@/lib/queries';
import { z } from 'zod';

const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

export type VerifyOtpRequest = z.infer<typeof VerifyOtpSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = VerifyOtpSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }

    const { email, otp } = validatedData.data;

    // Call verifyUserOtp function
    const result = await verifyUserOtp(email, otp);
    if (!result) {
      return NextResponse.json({ error: 'OTP verification failed' }, { status: 400 });
    }

    console.log(result.user.email, result.user.user_id);

    // Return the user and student data on successful verification
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
