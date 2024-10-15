import { NextResponse } from 'next/server';
import { getMeetingById, getAdvisorById, Meeting, Advisor } from '@/lib/queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const meeting: Meeting | null = await getMeetingById(Number(params.id));

    const advisor: Advisor | null = await getAdvisorById(meeting!.advisor_id!);

    return NextResponse.json({ meeting, advisor }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

