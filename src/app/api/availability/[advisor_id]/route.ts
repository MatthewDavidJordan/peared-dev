import { NextRequest, NextResponse } from 'next/server';
import ical from 'node-ical';
import { getTimezoneOffset } from 'date-fns-tz';
import { getAdvisorIcalLinkById } from '@/lib/queries';

interface AvailabilityEvent {
  start_time: string;
  end_time: string;
}

const resolveRecurrenceTimes = (event: ical.VEvent, dates: Date[]): Date[] => {
  return dates.map((date) => {
    if (!event.rrule) throw new Error("Event doesn't have a recurrence rule");

    const tzId = event.rrule.origOptions.tzid;
    if (tzId) {
      const offset = getTimezoneOffset(tzId, date);
      return new Date(date.getTime() - offset);
    } else {
      throw new Error('Timezone not provided');
    }
  });
};

export async function GET(
  request: NextRequest,
  { params }: { params: { advisor_id: string } },
): Promise<NextResponse<{ availabilityEvents: AvailabilityEvent[] } | { error: string }>> {
  try {
    const advisorId = parseInt(params.advisor_id);
    const icalLink = await getAdvisorIcalLinkById(advisorId);

    if (!icalLink) {
      return NextResponse.json({ availabilityEvents: [] });
    }

    const events: ical.CalendarResponse = await ical.async.fromURL(icalLink);

    const now: Date = new Date();
    const twoWeeksAhead: Date = new Date();
    twoWeeksAhead.setDate(now.getDate() + 14);

    const availabilityEvents: AvailabilityEvent[] = [];

    Object.values(events).forEach((event) => {
      if (event.type !== 'VEVENT') return;

      if (event.rrule) {
        const dates = event.rrule.between(now, twoWeeksAhead, true);

        resolveRecurrenceTimes(event, dates).forEach((date) => {
          const startDate = new Date(date);
          const duration = event.end.getTime() - event.start.getTime();
          const endDate = new Date(startDate.getTime() + duration);
          availabilityEvents.push({
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
          });
        });
      } else {
        if (
          event.start.getTime() >= now.getTime() &&
          event.end.getTime() <= twoWeeksAhead.getTime()
        ) {
          availabilityEvents.push({
            start_time: event.start.toISOString(),
            end_time: event.end.toISOString(),
          });
        }
      }
    });

    return NextResponse.json({ availabilityEvents });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
