import { NextResponse } from 'next/server';
import { getMeetingById } from '../../../queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const meeting = await getMeetingById(params.id);
        return NextResponse.json(meeting, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

