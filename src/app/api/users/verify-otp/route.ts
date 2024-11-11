import { NextResponse } from 'next/server';
import { createStudent, verifyUserOtp } from '@/lib/queries';
import { z } from 'zod';

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP for user
 *     description: |
 *       Verifies a one-time password (OTP) sent to user's email.
 *       On successful verification, returns user data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: 6-digit one-time password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     user_id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T10:00:00.000Z"
 *       400:
 *         description: Invalid input or OTP verification failed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Invalid input"
 *                     details:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Invalid email"]
 *                         otp:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Must be exactly 6 characters"]
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "OTP verification failed"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 */

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
