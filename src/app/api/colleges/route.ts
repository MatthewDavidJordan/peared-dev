import { NextResponse } from 'next/server';
import { getAllColleges } from '@/lib/queries';

export async function GET() {
  try {
    const colleges = await getAllColleges();
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}


