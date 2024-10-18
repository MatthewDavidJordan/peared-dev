import { supabase } from '@/lib/queries';
import { NextResponse } from 'next/server';
import ical from 'node-ical';

export type AvailabilityEvent = {
  start_time: string;
  end_time: string;
};

export async function getAdvisorAvailability(advisorId: number) {
  // Fetch the advisor's iCal link
  const { data: advisor, error: advisorError } = await supabase
    .from('advisors')
    .select('advisor_id, ical_link')
    .eq('advisor_id', advisorId)
    .single();

  if (advisorError || !advisor) return null;

  if (!advisor.ical_link) return null;

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

  return availabilityEvents;
}

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
