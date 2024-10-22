// api/meeting/routes.ts

import { createMeeting, Meeting, getAdvisorById, getStudentById } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserById } from '@/lib/queries';
import { format } from 'date-fns';

const CreateMeetingSchema = z.object({
  advisor_id: z.number(),
  student_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
});

export type CreateMeetingRequest = z.infer<typeof CreateMeetingSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = CreateMeetingSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }

    const { advisor_id, student_id, start_time, end_time } = validatedData.data;

    const meeting: Meeting | null = await createMeeting(
      advisor_id,
      student_id,
      start_time,
      end_time,
    );

    // Fetch student and advisor details
    const student = await getStudentById(student_id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentUser = await getUserById(student.user_id);

    const advisor = await getAdvisorById(advisor_id);
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    const advisorUser = await getUserById(advisor.user_id);

    // Format the start time
    const formattedStartTime = format(new Date(start_time), 'EEEE, MMMM do yyyy, h:mm a');

    // Prepare email data
    const emailRequestBody = {
      type: 'meetingConfirmation',
      to: studentUser.email,
      data: {
        studentName: studentUser.name,
        advisorName: advisorUser.name,
        formattedStartTime,
      },
    };

    // Send email by making a request to the email API route
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.EMAIL_API_KEY && { 'x-api-key': process.env.EMAIL_API_KEY }),
      },
      body: JSON.stringify(emailRequestBody),
    });

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
