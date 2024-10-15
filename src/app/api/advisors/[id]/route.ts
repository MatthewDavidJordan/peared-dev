import { NextResponse } from 'next/server';
import { Advisor, getAdvisorById, getAdvisorsForCollege } from '@/lib/queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const type: string = searchParams.get('type')!;

  try {
    if (type === 'advisorId') {
      const advisorId = Number(params.id);
      if (isNaN(advisorId)) {
        return NextResponse.json({ error: 'Invalid advisor ID' }, { status: 400 });
      }

      const advisor: Advisor | null = await getAdvisorById(advisorId);
      return NextResponse.json(advisor, { status: 200 });
    } else if (type === 'collegeId') {
      const collegeId = Number(params.id);
      if (isNaN(collegeId)) {
        return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
      }

      const advisors: Advisor[] = await getAdvisorsForCollege(collegeId);
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
