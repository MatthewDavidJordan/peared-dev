import { NextResponse } from 'next/server';
import { Availability, getScheduleByAdvisorId } from '@/lib/queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const schedule: Availability | null = await getScheduleByAdvisorId(Number(params.id));
    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
