import {
  AuthUser,
  createStudent,
  getAuthUserFromActiveSession,
  signUpAndSignIn,
} from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user or initiate OTP flow
 *     description: |
 *       Handles user creation and authentication flow:
 *       1. If user doesn't exist: Creates new user and sends OTP
 *       2. If user exists but not signed in: Sends OTP
 *       3. If user exists and is signed in: Returns user data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "user@example.com"
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *                 description: User's first name
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *                 description: User's last name
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: OTP sent response
 *                   properties:
 *                     otpSent:
 *                       type: boolean
 *                       example: true
 *                 - type: object
 *                   description: Active session response
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-01T10:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input to /api/users/route.ts endpoint"
 *                 details:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Invalid email"]
 *                     first_name:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["String must contain at least 1 character(s)"]
 *                     last_name:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["String must contain at least 1 character(s)"]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     creation:
 *                       value: "Error creating student"
 *                     session:
 *                       value: "Error retrieving active session"
 *                     unknown:
 *                       value: "An unknown error occurred"
 */

const CreateUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = CreateUserSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid input to /api/users/route.ts endpoint',
          details: validatedData.error.format(),
        },
        { status: 400 },
      );
    }

    const { email, first_name, last_name } = validatedData.data;

    // Check if the user is signed in or send OTP if not
    const result = await signUpAndSignIn(email);
    // result is either true, false, or "new"

    if (result === 'new') {
      // call createStudent with email, first_name, last_name
      const creationResult = await createStudent(email, first_name, last_name);
      // if there is an error, return 500
      if (!creationResult) {
        return NextResponse.json({ error: 'Error creating student' }, { status: 500 });
      }
    }

    if (result === 'new' || result === false) {
      return NextResponse.json({ otpSent: true }, { status: 200 });
    }

    if (result === true) {
      // If already signed in, get the active user session and return the user
      const user: AuthUser | null = await getAuthUserFromActiveSession();
      if (!user) {
        return NextResponse.json({ error: 'Error retrieving active session' }, { status: 500 });
      }

      return NextResponse.json({ user }, { status: 200 });
    } else {
      // If no active session, OTP has been sent; notify frontend to display OTP input
      return NextResponse.json({ otpSent: true }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
