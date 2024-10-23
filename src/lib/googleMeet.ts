// lib/googleMeet.ts
import { google } from 'googleapis';
import axios from 'axios';

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "peared.org"
);

export async function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return authUrl;
}

export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens.access_token;
}

export async function createGoogleMeet() {
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
  } catch (error: unknown) {
    throw new Error('Failed to create Google Meet: ' + error);
  }
}
