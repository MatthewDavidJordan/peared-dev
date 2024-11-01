// /app/api/users/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { createStudent, getStudentIdByUserId } from '@/lib/queries';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body.user_id;

    // try to create a student with the user_id
    const student = await createStudent(user_id);
    if (!student) {
      // there is a duplicate student so try to get student by user_id
      const student = await getStudentIdByUserId(user_id);
      return NextResponse.json(student, { status: 200 });
    }

    // Return the user and student data on successful verification
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
