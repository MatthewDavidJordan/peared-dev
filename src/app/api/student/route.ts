import {
  createStudent,
  getProfileByProfileId,
  getProfileIdByUserId,
  getStudentByProfileId,
  studentExists,
} from '@/lib/queries';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create or retrieve student
 *     description: |
 *       Creates a new student record or retrieves an existing one based on the user_id.
 *       Process:
 *       1. Gets profile_id from user_id
 *       2. Retrieves profile information
 *       3. Checks if student record exists
 *       4. Either returns existing student or creates new one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: Supabase user ID
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Student successfully created or retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: integer
 *                   example: 1
 *                 profile_id:
 *                   type: integer
 *                   example: 100
 *                 first_name:
 *                   type: string
 *                   example: "John"
 *                 last_name:
 *                   type: string
 *                   example: "Doe"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T10:00:00.000Z"
 *                 profiles:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *       400:
 *         description: Invalid user_id or profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Profile not found for user_id"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     failedGet:
 *                       value: "Failed to get student from supabase after getStudentsByProfileId in /api/student"
 *                     failedCreate:
 *                       value: "Failed to create student after finding that student does not exist in /api/student"
 *                     unknown:
 *                       value: "An unknown error occurred"
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body.user_id;

    const profile_id = await getProfileIdByUserId(user_id);
    const profile = await getProfileByProfileId(profile_id);

    // check if a student with the profile_id already exists
    const doesStudentExist: boolean = await studentExists(profile.id);

    if (doesStudentExist) {
      // get the student and return it
      const student = await getStudentByProfileId(profile.id);
      if (!student) {
        throw new Error(
          'Failed to get student from supabase after getStudentsByProfileId in /api/student',
        );
      }
      return NextResponse.json(student, { status: 200 });
    }

    // create a new student
    const student = await createStudent(profile.id, profile.first_name, profile.last_name);
    if (!student) {
      throw new Error(
        'Failed to create student after finding that student does not exist in /api/student',
      );
    }
    // Return the student
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error(error);
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
