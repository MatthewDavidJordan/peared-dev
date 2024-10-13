//meetings [id] route
import { NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const meeting = await getMeetingById(Number(params.id)); // Cast to number
    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
