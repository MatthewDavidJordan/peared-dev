import { NextResponse } from 'next/server';
import { createUser } from '../../../queries';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const user = await createUser(email, password);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

