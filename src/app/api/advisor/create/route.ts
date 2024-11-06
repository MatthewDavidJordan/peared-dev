// /app/api/advisor/create/route.ts
import { NextResponse } from 'next/server';
import { createAdvisor } from '@/lib/queries';
import { z } from 'zod';

/**
 * @swagger
 * /api/advisors/create:
 *   post:
 *     tags:
 *       - Advisors
 *     summary: Create a new advisor
 *     description: Creates a new advisor profile with the provided information including school affiliation and calendar link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - school_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Advisor's email address
 *                 example: "advisor@university.edu"
 *               first_name:
 *                 type: string
 *                 description: Advisor's first name
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: Advisor's last name
 *                 example: "Doe"
 *               school_id:
 *                 type: integer
 *                 description: ID of the school/institution
 *                 example: 1
 *               bio:
 *                 type: string
 *                 description: Advisor's biography
 *                 example: "Mathematics professor with 10 years of experience"
 *               advisor_image:
 *                 type: string
 *                 description: URL to advisor's profile image
 *                 example: "https://example.com/image.jpg"
 *               ical_link:
 *                 type: string
 *                 description: iCal calendar link for availability
 *                 example: "https://calendar.google.com/calendar/ical/..."
 *     responses:
 *       200:
 *         description: Advisor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 advisor_id:
 *                   type: integer
 *                   example: 1
 *                 profile_id:
 *                   type: integer
 *                   example: 1
 *                 school_id:
 *                   type: integer
 *                   example: 1
 *                 bio:
 *                   type: string
 *                   example: "Mathematics professor with 10 years of experience"
 *                 advisor_image:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 ical_link:
 *                   type: string
 *                   example: "https://calendar.google.com/calendar/ical/..."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creating advisor"
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const school_id = body.school_id;
    const bio = body.bio;
    const advisor_image = body.advisor_image;
    const ical_link = body.ical_link;

    const advisor = await createAdvisor(
      email,
      first_name,
      last_name,
      school_id,
      bio,
      advisor_image,
      ical_link,
    );
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
