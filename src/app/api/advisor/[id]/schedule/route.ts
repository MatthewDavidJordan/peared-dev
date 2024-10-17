//advisor\[id]\schedule\route.ts
import { NextResponse } from 'next/server';
import { getScheduleByAdvisorId } from '@/lib/queries';
import ical from 'node-ical';
import { Json } from '@/lib/supabase-types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const schedule = (await getScheduleByAdvisorId(Number(params.id))) as {
      advisor_id: number | null;
      availability_id: number;
      conflicts: Json;
      default_friday_schedule: Json;
      default_monday_schedule: Json;
      default_saturday_schedule: Json;
      default_sunday_schedule: Json;
      default_thursday_schedule: Json;
      default_tuesday_schedule: Json;
      default_wednesday_schedule: Json;
      ical_link?: string;
    };

    if (!schedule.ical_link) {
      return NextResponse.json({ error: 'iCal link not found' }, { status: 404 });
    }

    // Fetch and parse the iCal link
    const events = await ical.async.fromURL(schedule.ical_link);
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const eventArray = Object.values(events)
      .filter((event: any) => {
        return event.start >= twoWeeksAgo && event.start <= now;
      })
      .map((event: any) => ({
        start: event.start,
        end: event.end,
      }));

    return NextResponse.json({ events: eventArray }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
