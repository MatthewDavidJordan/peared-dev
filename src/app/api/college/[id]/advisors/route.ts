import { getAdvisorsForCollege } from '@/lib/queries';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/college/{id}/advisors:
 *   get:
 *     tags:
 *       - College
 *     summary: Get advisors for a college
 *     description: Retrieves all advisors associated with a specific college
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: College ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved advisors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   advisor_id:
 *                     type: integer
 *                     example: 1
 *                   profile_id:
 *                     type: integer
 *                     example: 100
 *                   school_id:
 *                     type: integer
 *                     example: 1
 *                   bio:
 *                     type: string
 *                     example: "Mathematics professor with 10 years of experience"
 *                   advisor_image:
 *                     type: string
 *                     nullable: true
 *                     example: "https://example.com/image.jpg"
 *                   ical_link:
 *                     type: string
 *                     nullable: true
 *                     example: "https://calendar.google.com/calendar/ical/..."
 *                   profiles:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "advisor@university.edu"
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *               example:
 *                 - advisor_id: 1
 *                   profile_id: 100
 *                   school_id: 1
 *                   bio: "Mathematics professor with 10 years of experience"
 *                   advisor_image: "https://example.com/image.jpg"
 *                   ical_link: "https://calendar.google.com/calendar/ical/..."
 *                   profiles:
 *                     email: "advisor@university.edu"
 *                     first_name: "John"
 *                     last_name: "Doe"
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const advisors = await getAdvisorsForCollege(Number(params.id));
    return NextResponse.json(advisors, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
