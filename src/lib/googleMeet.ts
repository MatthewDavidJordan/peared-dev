import { google } from "googleapis";

// Define the OAuth2 client with the admin credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export default async function createGoogleMeetWithParticipants(startTime: string, endTime: string, advisorEmail: string, studentEmail: string): Promise<string> {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Define the event
    const event = {
      summary: 'Advisory Meeting',
      start: {
        dateTime: startTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: advisorEmail },
        { email: studentEmail },
        { email: process.env.ADMIN_EMAIL },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    });

    return response.data.hangoutLink!;
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    throw new Error('Failed to create Google Meet');
  }
}