import { NextResponse } from 'next/server';
import { getScheduleByAdvisorId } from '../../../../queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const schedule = await getScheduleByAdvisorId(params.id);
        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
