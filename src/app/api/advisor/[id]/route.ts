//advisor/[id]/route.ts
import { NextResponse } from 'next/server';
import { Advisor, getAdvisorById } from '@/lib/queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const advisor: Advisor | null = await getAdvisorById(Number(params.id));
    return NextResponse.json(advisor, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
