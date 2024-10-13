//advisors/[id]/route.ts
import { NextResponse } from 'next/server';
import { getAdvisorById, getAdvisorsForCollege } from '@/lib/queries';

// Dynamic route handling for both advisorId and collegeId
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // Query parameter to distinguish between advisorId and collegeId

  try {
    if (type === 'advisorId') {
      // Fetch a single advisor by advisorId
      const advisorId = Number(params.id);
      if (isNaN(advisorId)) {
        return NextResponse.json({ error: 'Invalid advisor ID' }, { status: 400 });
      }

      const advisor = await getAdvisorById(advisorId);
      return NextResponse.json(advisor, { status: 200 });
    } else if (type === 'collegeId') {
      // Fetch multiple advisors by collegeId
      const collegeId = Number(params.id);
      if (isNaN(collegeId)) {
        return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
      }

      const advisors = await getAdvisorsForCollege(collegeId);
      return NextResponse.json(advisors, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid query type' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
