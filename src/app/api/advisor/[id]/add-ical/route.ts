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

    // 1. Update the iCal link in the database
    const { data, error } = await supabase
      .from('availability')
      .update({ ical_link })
      .eq('advisor_id', Number(params.id))
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. If iCal link is valid, fetch and parse the iCal data
    if (ical_link) {
      const events = await ical.async.fromURL(ical_link);
      const now = new Date();
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);

      const eventArray = Object.values(events)
        .filter((event: any) => event.start >= twoWeeksAgo && event.start <= now)
        .map((event: any) => ({
          start_time: event.start,
          end_time: event.end,
        }));

      // 3. Update the parsed events into the availability table (e.g., conflicts field)
      const { error: updateError } = await supabase
        .from('availability')
        .update({
          conflicts: eventArray, // Store the events in 'conflicts' field (or another field if needed)
        })
        .eq('advisor_id', Number(params.id));

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // 4. Respond with success
      return NextResponse.json(
        { success: 'iCal link and availability updated with events', data: eventArray },
        { status: 200 },
      );
    }

    return NextResponse.json({ success: 'iCal link updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
