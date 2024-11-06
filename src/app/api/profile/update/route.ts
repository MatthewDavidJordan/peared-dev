import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { updateProfile } from '@/lib/queries';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  profile_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateProfileSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }

    const { profile_id, first_name, last_name } = validatedData.data;

    // Update profile
    const updatedProfile = await updateProfile(profile_id, first_name, last_name);

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          type: error.constructor.name,
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
