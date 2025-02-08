import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

import iconLignt from '@/../public/LightMode.ico';
import iconDark from '@/../public/favicon.ico';
import { AuthContextProvider } from '@/lib/hooks/useAuth';

export const metadata: Metadata = {
  title: 'peared',
  description: 'Find your perfect college (student) advisor.',
  icons: [
    {
      media: '(prefers-color-scheme: light)',
      url: iconLignt.src,
      type: 'image/svg+xml',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: iconDark.src,
      type: 'image/svg+xml',
    },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>{props.children}</AuthContextProvider>
      </body>
    </html>
  );
}
