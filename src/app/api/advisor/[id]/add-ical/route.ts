// api/advisor/[id]/add-ical/routes.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import ical from 'node-ical';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { ical_link } = body;

    if (!ical_link) {
      return NextResponse.json({ error: 'iCal link is required' }, { status: 400 });
    }

    // Update the iCal link in the availability table
    const { data, error } = await supabase
      .from('availability')
      .update({ ical_link })
      .eq('advisor_id', Number(params.id))
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no row was updated, insert a new one
    if (!data || data.length === 0) {
      const { data: insertData, error: insertError } = await supabase.from('availability').insert({
        advisor_id: Number(params.id),
        ical_link,
      });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    // Fetch and parse the iCal data
    const events = await ical.async.fromURL(ical_link);
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const eventArray = Object.values(events)
      .filter(
        (event: any) =>
          event.start && event.end && event.start instanceof Date && event.end instanceof Date,
      )
      .filter((event: any) => event.start >= twoWeeksAgo && event.start <= now)
      .map((event: any) => ({
        start_time: event.start,
        end_time: event.end,
      }));

    // Update the parsed events in the 'conflicts' field
    const { error: updateError } = await supabase
      .from('availability')
      .update({
        conflicts: eventArray,
      })
      .eq('advisor_id', Number(params.id));

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: 'iCal link and availability updated with events', data: eventArray },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 },
    );
  }
}
