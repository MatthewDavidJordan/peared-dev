import { getCollegeById } from '@/lib/queries';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/college/{id}:
 *   get:
 *     tags:
 *       - College
 *     summary: Get college by ID
 *     description: Retrieves detailed information for a specific college
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique identifier of the college
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved college information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 school_id:
 *                   type: integer
 *                   description: Unique identifier for the college
 *                   example: 1
 *                 school_name:
 *                   type: string
 *                   description: Name of the college
 *                   example: "Stanford University"
 *                 school_logo:
 *                   type: string
 *                   nullable: true
 *                   description: URL to the college's logo
 *                   example: "https://example.com/stanford-logo.png"
 *                 domain:
 *                   type: string
 *                   description: College's email domain
 *                   example: "stanford.edu"
 *       404:
 *         description: College not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "College not found"
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

  const {
    id
  } = params;

  try {
    const college = await getCollegeById(Number(id));
    return NextResponse.json(college, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
