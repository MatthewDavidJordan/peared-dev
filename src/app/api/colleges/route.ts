import { NextResponse } from 'next/server';
import { College, getAllColleges } from '@/lib/queries';

/**
 * @swagger
 * /api/college:
 *   get:
 *     tags:
 *       - College
 *     summary: Get all colleges
 *     description: Retrieves a list of all colleges in the system
 *     responses:
 *       200:
 *         description: Successfully retrieved colleges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   school_id:
 *                     type: integer
 *                     description: Unique identifier for the college
 *                     example: 1
 *                   school_name:
 *                     type: string
 *                     description: Name of the college
 *                     example: "Stanford University"
 *                   school_logo:
 *                     type: string
 *                     nullable: true
 *                     description: URL to the college's logo
 *                     example: "https://example.com/stanford-logo.png"
 *                   domain:
 *                     type: string
 *                     description: College's email domain
 *                     example: "stanford.edu"
 *               example:
 *                 - school_id: 1
 *                   school_name: "Stanford University"
 *                   school_logo: "https://example.com/stanford-logo.png"
 *                   domain: "stanford.edu"
 *                 - school_id: 2
 *                   school_name: "MIT"
 *                   school_logo: "https://example.com/mit-logo.png"
 *                   domain: "mit.edu"
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

export async function GET(req: Request) {
  try {
    const colleges: College[] = await getAllColleges();
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
