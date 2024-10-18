// api/advisor/[id]/add-ical/routes.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/queries';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { ical_link } = body;

    if (!ical_link) {
      return NextResponse.json({ error: 'iCal link is required' }, { status: 400 });
    }

    // Update the iCal link in the advisors table
    const { data, error } = await supabase
      .from('advisors')
      .update({ ical_link })
      .eq('advisor_id', Number(params.id))
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: 'iCal link updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 },
    );
  }
}
