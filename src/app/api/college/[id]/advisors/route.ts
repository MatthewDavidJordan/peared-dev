//college/[id]/advisors/route.ts
import { getAdvisorsForCollege } from '@/lib/queries';
import { NextResponse } from 'next/server';

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
