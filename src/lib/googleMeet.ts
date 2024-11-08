// src/lib/googleMeet.ts
import { google } from 'googleapis';

interface MeetingConfig {
  startTime: string;
  endTime: string;
  advisorEmail: string;
  studentEmail: string;
  timeZone?: string;
}

function validateEnvironmentVariables() {
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return requiredVars as { [K in keyof typeof requiredVars]: string };
}

export async function createGoogleMeetWithParticipants({
  startTime,
  endTime,
  advisorEmail,
  studentEmail,
  timeZone = 'America/New_York',
}: MeetingConfig): Promise<string> {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
      validateEnvironmentVariables();

    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

    oauth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: 'Peared Advisory Meeting',
      description: 'Meeting between advisor and student',
      start: {
        dateTime: startTime,
        timeZone,
      },
      end: {
        dateTime: endTime,
        timeZone,
      },
      attendees: [{ email: advisorEmail }, { email: studentEmail }],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
          conferenceDataVersion: 1,
        },
      },
    };

    console.log('Creating calendar event with:', {
      ...event,
      attendees: event.attendees.map((a) => a.email),
    });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: event,
    });

    console.log('Calendar response:', response.data);

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === 'video',
    )?.uri;

    if (!meetLink) {
      throw new Error('No Google Meet link generated in the response');
    }

    return meetLink;
  } catch (error) {
    console.error('Detailed error in createGoogleMeetWithParticipants:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create Google Meet: ${errorMessage}`);
  }
}
