import { NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Initiate Google OAuth flow
 *     description: |
 *       Redirects the user to Google's OAuth consent screen to begin the authentication process.
 *       Requests access to Google Calendar and Calendar Events with offline access for refresh tokens.
 *     responses:
 *       302:
 *         description: Redirects to Google's OAuth consent screen
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: https://accounts.google.com/o/oauth2/v2/auth?...
 *             description: Google OAuth authorization URL
 *     security: []  # No authentication required for this endpoint
 */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
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
