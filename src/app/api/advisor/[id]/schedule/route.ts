import { NextResponse } from 'next/server';
import { supabase } from '@/lib/queries';
import ical from 'node-ical';

type AvailabilityEvent = {
  start_time: string;
  end_time: string;
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch the advisor's iCal link
    const { data: advisor, error: advisorError } = await supabase
      .from('advisors')
      .select('advisor_id, ical_link')
      .eq('advisor_id', Number(params.id))
      .single();

    if (advisorError || !advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    if (!advisor.ical_link) {
      return NextResponse.json({ error: 'iCal link not found for advisor' }, { status: 404 });
    }

    // Parse the iCal link
    const events = await ical.async.fromURL(advisor.ical_link);

    // Set the date range
    const now = new Date();
    const twoWeeksAhead = new Date();
    twoWeeksAhead.setDate(now.getDate() + 14);

    const availabilityEvents: AvailabilityEvent[] = [];

    Object.values(events).forEach((event: any) => {
      if (event.type === 'VEVENT') {
        if (event.rrule) {
          // Handle recurring events
          const dates = event.rrule.between(now, twoWeeksAhead, true);
          dates.forEach((date: Date) => {
            const startDate = new Date(date);
            const duration = event.end.getTime() - event.start.getTime();
            const endDate = new Date(startDate.getTime() + duration);
            availabilityEvents.push({
              start_time: startDate.toISOString(),
              end_time: endDate.toISOString(),
            });
          });
        } else {
          // Handle single events
          if (event.start >= now && event.start <= twoWeeksAhead) {
            availabilityEvents.push({
              start_time: event.start.toISOString(),
              end_time: event.end.toISOString(),
            });
          }
        }
      }
    });

    return NextResponse.json(
      { success: 'Availability fetched successfully', events: availabilityEvents },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in schedule route:', error);
    return NextResponse.json(
      { error: 'An unknown error occurred', details: (error as Error).message },
      { status: 500 },
    );
  }
}
