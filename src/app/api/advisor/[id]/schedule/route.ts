//advisor\[id]\schedule\route.ts
import { NextResponse } from 'next/server';
import { getScheduleByAdvisorId, supabase } from '@/lib/queries';
import ical from 'node-ical';
import { createClient } from '@supabase/supabase-js'; // Assuming you have a Supabase client instance here

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch the advisor's availability and iCal link
    const schedule = (await getScheduleByAdvisorId(Number(params.id))) as {
      advisor_id: number | null;
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

    // Initialize day-specific schedules
    let mondayEvents: { start_time: Date; end_time: Date }[] = [];
    let tuesdayEvents: { start_time: Date; end_time: Date }[] = [];
    let wednesdayEvents: { start_time: Date; end_time: Date }[] = [];
    let thursdayEvents: { start_time: Date; end_time: Date }[] = [];
    let fridayEvents: { start_time: Date; end_time: Date }[] = [];
    let saturdayEvents: { start_time: Date; end_time: Date }[] = [];
    let sundayEvents: { start_time: Date; end_time: Date }[] = [];

    // Filter events from the last two weeks and categorize them by day of the week
    Object.values(events).forEach((event: any) => {
      if (event.start >= twoWeeksAgo && event.start <= now) {
        const eventDay = new Date(event.start).getDay();
        const eventObject = { start_time: event.start, end_time: event.end };

        switch (eventDay) {
          case 1: // Monday
            mondayEvents.push(eventObject);
            break;
          case 2: // Tuesday
            tuesdayEvents.push(eventObject);
            break;
          case 3: // Wednesday
            wednesdayEvents.push(eventObject);
            break;
          case 4: // Thursday
            thursdayEvents.push(eventObject);
            break;
          case 5: // Friday
            fridayEvents.push(eventObject);
            break;
          case 6: // Saturday
            saturdayEvents.push(eventObject);
            break;
          case 0: // Sunday
            sundayEvents.push(eventObject);
            break;
        }
      }
    });

    // Update the availability with the day-specific schedules
    const { error } = await supabase
      .from('availability')
      .update({
        default_monday_schedule:
          mondayEvents.length > 0
            ? mondayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_tuesday_schedule:
          tuesdayEvents.length > 0
            ? tuesdayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_wednesday_schedule:
          wednesdayEvents.length > 0
            ? wednesdayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_thursday_schedule:
          thursdayEvents.length > 0
            ? thursdayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_friday_schedule:
          fridayEvents.length > 0
            ? fridayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_saturday_schedule:
          saturdayEvents.length > 0
            ? saturdayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
        default_sunday_schedule:
          sundayEvents.length > 0
            ? sundayEvents.map((event) => ({
                start_time: event.start_time.toISOString(),
                end_time: event.end_time.toISOString(),
              }))
            : null,
      })
      .eq('advisor_id', schedule.advisor_id as number);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: 'Availability updated with day-specific schedules',
        mondayEvents,
        tuesdayEvents,
        wednesdayEvents,
        thursdayEvents,
        fridayEvents,
        saturdayEvents,
        sundayEvents,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
