//users/routes.ts
import { signInWithOtp } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
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

    const { error } = await signInWithOtp(email);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Magic link sent to email' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
