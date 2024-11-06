// src/app/api/auth/google/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // Make sure to add this URL to your Google OAuth consent screen
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
);

export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    prompt: 'consent',
  });

  return NextResponse.redirect(authUrl);
}
