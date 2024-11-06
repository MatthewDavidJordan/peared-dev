// src/app/api/meetings/route.ts
import { createGoogleMeetWithParticipants } from '@/lib/googleMeet';
import { createMeeting, getAdvisorById, getStudentById, Meeting } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateMeetingSchema = z.object({
  advisor_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  student_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  start_time: z.string(),
  end_time: z.string(),
});

export type CreateMeetingRequest = z.infer<typeof CreateMeetingSchema>;

export async function POST(req: Request) {
  console.log('=== Starting POST request handling ===');

  try {
    console.log('Reading request body...');
    const body = await req.json();
    console.log('Request body:', body);

    console.log('Validating input data...');
    const validatedData = CreateMeetingSchema.safeParse(body);
    if (!validatedData.success) {
      console.log('Validation failed:', validatedData.error.format());
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }
    console.log('Input validation successful');

    const { advisor_id, student_id, start_time, end_time } = validatedData.data;

    // Fetch advisor details
    console.log(`Fetching advisor details for ID: ${advisor_id}...`);
    const advisor: Awaited<ReturnType<typeof getAdvisorById>> = await getAdvisorById(advisor_id);
    if (!advisor) {
      console.log('Advisor not found');
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }
    console.log('Advisor found:', {
      advisor_id: advisor.advisor_id,
      profile_id: advisor.profile_id,
    });

    // Fetch student details
    console.log(`Fetching student details for ID: ${student_id}...`);
    const student: Awaited<ReturnType<typeof getStudentById>> = await getStudentById(student_id);
    if (!student) {
      console.log('Student not found');
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    console.log('Student found:', {
      student_id: student.student_id,
      profile_id: student.profile_id,
    });

    console.log("Advisor's email:", advisor.profiles?.email);
    console.log("Student's email:", student.profiles?.email);

    const advisorEmail = advisor.profiles?.email;
    const studentEmail = student.profiles?.email;

    if (!advisorEmail || !studentEmail) {
      console.log('Missing email(s):', {
        advisorEmail: !!advisorEmail,
        studentEmail: !!studentEmail,
      });
      return NextResponse.json({ error: 'Advisor or student email not found' }, { status: 400 });
    }

    // Create Google Meet
    console.log('Creating Google Meet with parameters:', {
      startTime: start_time,
      endTime: end_time,
      advisorEmail,
      studentEmail,
    });

    const meetingUrl: string = await createGoogleMeetWithParticipants({
      startTime: start_time,
      endTime: end_time,
      advisorEmail,
      studentEmail,
    });

    console.log('Google Meet created successfully:', meetingUrl);

    // Create meeting record
    console.log('Creating meeting record in database...');
    const meeting: Meeting = await createMeeting(
      advisor_id,
      student_id,
      start_time,
      end_time,
      meetingUrl,
    );
    console.log('Meeting record created:', meeting);

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error('=== Error in POST handler ===');
    console.error('Error type:', typeof error);
    console.error('Error instanceof Error:', error instanceof Error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error object:', JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          type: error.constructor.name,
          ...((error as any).status && { status: (error as any).status }),
          ...((error as any).code && { code: (error as any).code }),
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
