import { getAdvisorAvailability } from '@/lib/queries';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const availabilityEvents = await getAdvisorAvailability(Number(params.id));
    if (!availabilityEvents) {
      return NextResponse.json(
        { error: 'Advisor not found or has no availability' },
        { status: 404 },
      );
    }

    return NextResponse.json(availabilityEvents, { status: 200 });
  } catch (error) {
    console.error('Error in schedule route:', error);
    return NextResponse.json(
      { error: 'An unknown error occurred', details: (error as Error).message },
      { status: 500 },
    );
  }
}
