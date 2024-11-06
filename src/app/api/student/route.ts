// /app/api/students/route.ts
import { NextResponse } from 'next/server';
import {
  createStudent,
  getProfileIdByUserId,
  getProfileByProfileId,
  studentExists,
  getStudentByProfileId,
} from '@/lib/queries';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body.user_id;

    const profile_id = await getProfileIdByUserId(user_id);
    const profile = await getProfileByProfileId(profile_id);

    // check if a student with the profile_id already exists
    const doesStudentExist: boolean = await studentExists(profile.id);

    if (doesStudentExist) {
      // get the student and return it
      const student = await getStudentByProfileId(profile.id);
      if (!student) {
        throw new Error(
          'Failed to get student from supabase after getStudentsByProfileId in /api/student',
        );
      }
      return NextResponse.json(student, { status: 200 });
    }

    // create a new student
    const student = await createStudent(
      profile.id.toString(),
      profile.first_name,
      profile.last_name,
    );
    if (!student) {
      throw new Error(
        'Failed to create student after finding that student does not exist in /api/student',
      );
    }
    // Return the student
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
