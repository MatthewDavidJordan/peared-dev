import { NextResponse } from 'next/server';
import { getAdvisorsForCollege } from '@/lib/queries';

// Dynamic route handling
export async function GET(req: Request, { params }: { params: { collegeId: string } }) {
  try {
    const advisors = await getAdvisorsForCollege(Number(params.collegeId)); // Cast to number
    return NextResponse.json(advisors, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
