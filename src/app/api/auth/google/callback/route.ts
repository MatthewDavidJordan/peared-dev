// src/app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

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
