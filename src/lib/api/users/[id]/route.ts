import { NextResponse } from 'next/server';
import { getUserById } from '../../../queries';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getUserById(params.id);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
