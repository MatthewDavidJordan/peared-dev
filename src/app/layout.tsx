import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'College Compass',
  description: 'Find your perfect college (student) advisor.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        {props.children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
