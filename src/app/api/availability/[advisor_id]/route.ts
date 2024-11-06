import { getAdvisorIcalLinkById } from '@/lib/queries';
import IcalExpander from 'ical-expander';
import { NextRequest, NextResponse } from 'next/server';

interface AvailabilityEvent {
  start_time: string;
  end_time: string;
}

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

    const icalRes = await fetch(icalLink);
    const icalText = await icalRes.text();
    const icalExpander = new IcalExpander({ ics: icalText, maxIterations: 100 });

    const now: Date = new Date();
    const twoWeeksAhead: Date = new Date();
    twoWeeksAhead.setDate(now.getDate() + 14);

    const events = icalExpander.between(now, twoWeeksAhead);
    const availabilityEvents: AvailabilityEvent[] = [...events.events, ...events.occurrences].map(
      (event: any) => {
        return {
          start_time: event.startDate.toJSDate().toISOString(),
          end_time: event.endDate.toJSDate().toISOString(),
        };
      },
    );
    return NextResponse.json({ availabilityEvents });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
