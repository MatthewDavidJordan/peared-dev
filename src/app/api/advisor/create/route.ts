// /app/api/users/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { createAdvisor } from '@/lib/queries';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body.user_id;
    const name = body.name;
    const school_id = body.school_id;

    // try to create a student with the user_id
    const advisor = await createAdvisor(user_id, school_id, name);
    if (!advisor) {
      return NextResponse.json({ error: 'Error creating student' }, { status: 500 });
    }

    // Return the user and student data on successful verification
    return NextResponse.json(advisor, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
