import { createMeeting, getAdvisorById, getStudentById, Meeting } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     tags:
 *       - Meetings
 *     summary: Create a new meeting
 *     description: |
 *       Creates a new meeting between an advisor and a student.
 *       This will:
 *       1. Validate the input data
 *       2. Verify advisor and student exist
 *       3. Create a Google Meet link
 *       4. Create a meeting record in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - advisor_id
 *               - student_id
 *               - start_time
 *               - end_time
 *             properties:
 *               advisor_id:
 *                 type: integer
 *                 description: ID of the advisor
 *                 example: 1
 *               student_id:
 *                 type: integer
 *                 description: ID of the student
 *                 example: 1
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Meeting start time in ISO format
 *                 example: "2024-01-01T10:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Meeting end time in ISO format
 *                 example: "2024-01-01T11:00:00.000Z"
 *     responses:
 *       200:
 *         description: Meeting successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meeting_id:
 *                   type: integer
 *                   example: 1
 *                 advisor_id:
 *                   type: integer
 *                   example: 1
 *                 student_id:
 *                   type: integer
 *                   example: 1
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T10:00:00.000Z"
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T11:00:00.000Z"
 *                 meeting_url:
 *                   type: string
 *                   example: "https://meet.google.com/abc-defg-hij"
 *       400:
 *         description: Invalid input data or missing emails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *                 details:
 *                   type: object
 *                   example: {
 *                     "advisor_id": ["Required"],
 *                     "start_time": ["Invalid date format"]
 *                   }
 *       404:
 *         description: Advisor or student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Advisor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unknown error occurred"
 *                 type:
 *                   type: string
 *                   example: "Error"
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 code:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 */

const CreateMeetingSchema = z.object({
  advisor_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  student_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  start_time: z.string(),
  end_time: z.string(),
  meeting_form: z.object({
    college_familiarity: z.number(),
    reason: z.string(),
    extra_info: z.string(),
  }),
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

    const { advisor_id, student_id, start_time, end_time, meeting_form } = validatedData.data;

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

    // const meetingUrl: string = await createGoogleMeetWithParticipants({
    //   startTime: start_time,
    //   endTime: end_time,
    //   advisorEmail,
    //   studentEmail,
    // });
    const meetingUrl = 'TEST';

    console.log('Google Meet created successfully:', meetingUrl);

    // Create meeting record
    console.log('Creating meeting record in database...');
    const meeting: Meeting = await createMeeting(
      advisor_id,
      student_id,
      start_time,
      end_time,
      meetingUrl,
      meeting_form,
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
