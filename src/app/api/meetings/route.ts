import { createMeeting, Meeting } from '@/lib/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createGoogleMeet } from '@/lib/googleMeet';

const CreateMeetingSchema = z.object({
  advisor_id: z.number(),
  student_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
});

export type CreateMeetingRequest = z.infer<typeof CreateMeetingSchema>;

// Set up OAuth2 client with the provided credentials
const oauth2Client = new google.auth.OAuth2(
  "52346834054-ua7asl8bdfnoa41jqapr0s62mdsvjsnd.apps.googleusercontent.com",
  "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",
  "peared.org"
);

// Redirect the user to Google's OAuth 2.0 server to initiate authentication
export async function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return authUrl;
}

// Exchange authorization code for access token
export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens.access_token;
}

// Function to create a Google Meet
async function createGoogleMeet() {
  try {
    const response = await axios.post(
      'https://meet.googleapis.com/v1/meetings',
      {},
      {
        headers: {
          Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.joinUri;
  } catch (error) {
    console.error('Error creating Google Meet:', error.response.data);
    throw new Error('Failed to create Google Meet');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = CreateMeetingSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.format() },
        { status: 400 },
      );
    }

    const { advisor_id, student_id, start_time, end_time } = validatedData.data;

    const meetingUrl = await createGoogleMeet();

    const meeting: Meeting | null = await createMeeting(
      advisor_id,
      student_id,
      start_time,
      end_time,
      meetingUrl
    );

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
