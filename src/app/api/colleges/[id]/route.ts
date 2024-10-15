import { getCollegeById } from '@/lib/queries';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
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
