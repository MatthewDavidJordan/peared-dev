import { NextResponse } from 'next/server';
import { supabase, updateAdvisorIcalLinkById } from '@/lib/queries';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { ical_link } = body;

    if (!ical_link) {
      return NextResponse.json({ error: 'iCal link is required' }, { status: 400 });
    }

    updateAdvisorIcalLinkById(Number(params.id), ical_link);

    return NextResponse.json({ success: 'iCal link updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
