// /app/api/users/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { createAdvisor } from '@/lib/queries';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const school_id = body.school_id;
    const bio = body.bio;
    const advisor_image = body.advisor_image;
    const ical_link = body.ical_link;

    const advisor = await createAdvisor(
      email,
      first_name,
      last_name,
      school_id,
      bio,
      advisor_image,
      ical_link,
    );
    if (!advisor) {
      return NextResponse.json({ error: 'Error creating student' }, { status: 500 });
    }

    // Return the user and student data on successful verification
    return NextResponse.json(advisor, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
