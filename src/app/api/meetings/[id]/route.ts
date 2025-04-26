import { NextResponse } from 'next/server';
import { getMeetingById, getAdvisorById, Meeting, Advisor } from '@/lib/queries';

/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     tags:
 *       - Meetings
 *     summary: Get meeting details by ID
 *     description: Retrieves detailed information about a specific meeting including advisor details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Meeting details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meeting:
 *                   type: object
 *                   properties:
 *                     meeting_id:
 *                       type: integer
 *                       example: 1
 *                     advisor_id:
 *                       type: integer
 *                       example: 1
 *                     student_id:
 *                       type: integer
 *                       example: 1
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T10:00:00.000Z"
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T11:00:00.000Z"
 *                     meeting_url:
 *                       type: string
 *                       example: "https://meet.google.com/abc-defg-hij"
 *                 advisor:
 *                   type: object
 *                   properties:
 *                     advisor_id:
 *                       type: integer
 *                       example: 1
 *                     profile_id:
 *                       type: integer
 *                       example: 100
 *                     school_id:
 *                       type: integer
 *                       example: 1
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: "Mathematics professor with 10 years of experience"
 *                     advisor_image:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/advisor-image.jpg"
 *                     ical_link:
 *                       type: string
 *                       nullable: true
 *                       example: "https://calendar.google.com/calendar/ical/..."
 *                     profiles:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "advisor@university.edu"
 *                         first_name:
 *                           type: string
 *                           example: "John"
 *                         last_name:
 *                           type: string
 *                           example: "Doe"
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Meeting not found"
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
 */

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const meeting: Meeting = await getMeetingById(Number(params.id));

    const advisor: Advisor = await getAdvisorById(meeting.advisor_id!);

    return NextResponse.json({ meeting, advisor }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
