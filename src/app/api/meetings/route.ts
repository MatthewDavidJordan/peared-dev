import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createMeeting } from '@/lib/queries';

// Zod schema for meeting creation
const CreateMeetingSchema = z.object({
  advisor_id: z.string(), // Expecting a string from the client, will cast to number
  student_id: z.string(), // Expecting a string from the client, will cast to number
  start_time: z.string(),
  end_time: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate using Zod
    const validatedData = CreateMeetingSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedData.error.format() }, { status: 400 });
    }

    const { advisor_id, student_id, start_time, end_time } = validatedData.data;

    // Cast advisor_id and student_id to numbers (assuming the database expects numbers)
    const advisorIdNumber = Number(advisor_id);
    const studentIdNumber = Number(student_id);

    // Check if casting was successful
    if (isNaN(advisorIdNumber) || isNaN(studentIdNumber)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Call the createMeeting function with the correct types
    const meeting = await createMeeting(advisorIdNumber, studentIdNumber, start_time, end_time);

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
