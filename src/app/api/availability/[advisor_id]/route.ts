import { getAdvisorIcalLinkById } from '@/lib/queries';
// @ts-expect-error
import IcalExpander from 'ical-expander';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/availability/{advisor_id}:
 *   get:
 *     tags:
 *       - Availability
 *     summary: Get advisor's availability
 *     description: |
 *       Fetches an advisor's availability for the next two weeks from their iCal calendar.
 *       Returns parsed events as a list of start and end times.
 *     parameters:
 *       - in: path
 *         name: advisor_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advisor
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availabilityEvents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T09:00:00.000Z"
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T10:00:00.000Z"
 *                   example:
 *                     - start_time: "2024-01-01T09:00:00.000Z"
 *                       end_time: "2024-01-01T10:00:00.000Z"
 *                     - start_time: "2024-01-01T14:00:00.000Z"
 *                       end_time: "2024-01-01T15:00:00.000Z"
 *       404:
 *         description: No iCal link found for advisor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availabilityEvents:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Failed to fetch availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch availability"
 */

interface AvailabilityEvent {
  start_time: string;
  end_time: string;
}

export async function GET(request: NextRequest, props: { params: Promise<{ advisor_id: string }> }): Promise<NextResponse<{ availabilityEvents: AvailabilityEvent[] } | { error: string }>> {
  const params = await props.params;
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
