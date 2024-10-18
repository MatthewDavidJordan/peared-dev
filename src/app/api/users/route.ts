//users/routes.ts
import { createStudent, signUp } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
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

    const { email, name } = validatedData.data;

    const user = await signUp(email, name);
    if (!user) return NextResponse.json({ error: 'Error creating user' }, { status: 500 });

    console.log(user);

    const student = await createStudent(user.id);

    return NextResponse.json({ user, student }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
