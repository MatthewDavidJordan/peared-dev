import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/queries';

// Zod schema for user creation
const CreateUserSchema = z.object({
  email: z.string().email(), // Ensures email is a valid string and matches email format
  password: z.string().min(6), // Ensures password is a string and at least 6 characters long
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate using Zod
    const validatedData = CreateUserSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedData.error.format() }, { status: 400 });
    }

    const { email, password } = validatedData.data;

    const user = await createUser(email, password);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
