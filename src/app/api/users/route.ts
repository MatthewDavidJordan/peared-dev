// /users/routes.ts
import { AuthUser, getAuthUserFromActiveSession, signUpAndSignIn } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = CreateUserSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }

    const { email } = validatedData.data;

    // Check if the user is signed in or send OTP if not
    const isUserSignedIn: boolean = await signUpAndSignIn(email);

    if (isUserSignedIn) {
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
