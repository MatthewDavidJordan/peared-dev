// api/advisor/[id]/add-ical/routes.ts
import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { ical_link } = body;

    if (!ical_link) {
      return NextResponse.json({ error: 'iCal link is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('availability')
      .update({ ical_link })
      .eq('advisor_id', Number(params.id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: 'iCal link updated', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
