import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

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
        <Navbar />
        <ThemeRegistry>{props.children}</ThemeRegistry>
        <Footer />
      </body>
    </html>
  );
}
