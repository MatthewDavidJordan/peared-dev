import { google } from "googleapis";
import * as serviceAccount from "./service-account-key.json";


const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

export default async function createGoogleMeetWithParticipants(startTime: string, endTime: string, advisorEmail: string, studentEmail: string): Promise<string> {
  try {
    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

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