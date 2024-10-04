import { NextResponse } from 'next/server';
import { createMeeting } from '../../../queries';

export async function POST(req: Request) {
    try {
        const { advisor_id, student_id, start_time, end_time } = await req.json();
        const meeting = await createMeeting(advisor_id, student_id, start_time, end_time);
        return NextResponse.json(meeting, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
