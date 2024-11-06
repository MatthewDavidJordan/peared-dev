import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth callback handler
 *     description: Handles the OAuth callback from Google, exchanges the authorization code for tokens
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code provided by Google OAuth
 *     responses:
 *       200:
 *         description: OAuth successful, returns HTML page with refresh token
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <html>
 *                   <body>
 *                     <h1>OAuth Success!</h1>
 *                     <p>Here is your refresh token...</p>
 *                   </body>
 *                 </html>
 *       400:
 *         description: No authorization code provided
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No code provided
 *       500:
 *         description: Error exchanging code for tokens
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error getting tokens
 *     security:
 *       - google_oauth: []
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     google_oauth:
 *       type: oauth2
 *       description: Google OAuth 2.0 authentication
 *       flows:
 *         authorizationCode:
 *           authorizationUrl: https://accounts.google.com/o/oauth2/v2/auth
 *           tokenUrl: https://oauth2.googleapis.com/token
 *           scopes:
 *             https://www.googleapis.com/auth/calendar: Access to Google Calendar
 *             https://www.googleapis.com/auth/calendar.events: Access to Calendar events
 */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return new NextResponse(
      `
      <html>
        <body>
          <h1>OAuth Success!</h1>
          <p>Here is your refresh token (save it in your environment variables):</p>
          <pre>${tokens.refresh_token}</pre>
          <p>Add this to your .env file as GOOGLE_REFRESH_TOKEN</p>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      },
    );
  } catch (error) {
    console.error('Error getting tokens:', error);
    return new NextResponse('Error getting tokens', { status: 500 });
  }
}
