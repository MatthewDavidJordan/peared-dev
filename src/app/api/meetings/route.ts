import { createMeeting, Meeting } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createGoogleMeet } from '@/lib/googleMeet';

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

    const meetingUrl = await createGoogleMeet();

    const meeting: Meeting | null = await createMeeting(
      advisor_id,
      student_id,
      start_time,
      end_time,
      meetingUrl
    );

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
