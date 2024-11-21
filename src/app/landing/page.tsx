import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Lexend } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['500', '700'],
});

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-[#fef9e3] ${lexend.className}`}>
      {/* Navigation */}
      <nav className="bg-[#3e516e]">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/WordLogo.svg"
              alt="Peared Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#fef9e3] py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-5xl font-bold text-[#3e516e]">
            <span>Discover </span>
            <span className="text-[#61a46e]">Your</span>
            <span> Perfect College Fit</span>
          </h1>
          <p className="text-lg font-medium text-[#3e516e]/80">
            Connect with real students. Get authentic insights. Make informed decisions.
          </p>
          <Button
            asChild
            className="mt-8 bg-[#c4db6e] px-8 py-6 text-lg font-bold text-[#3e516e] hover:bg-[#c4db6e]/90"
          >
            <Link href="https://forms.gle/LEQmYHLgdH3aqpZVA">Schedule a Call</Link>
          </Button>
        </div>
      </section>

      {/* Browse Section */}
      <section className="bg-[#3e516e] py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-5xl font-bold text-[#c4db6e] md:text-6xl">Browse</h2>
              <p className="text-xl font-medium leading-relaxed text-[#fef9e3] md:text-2xl">
                Browse through our vetted advisors to find the most relevant match for you. We
                recommend looking for advisors with similar majors, hometowns, or extracurricilars.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <Image
                src="/browsing.svg"
                alt="Browse Illustration"
                width={500}
                height={375}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section className="bg-[#BFBBAA] py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-5xl font-bold text-[#3e516e] md:text-6xl">Book</h2>
              <p className="text-xl font-medium leading-relaxed text-[#3e516e]/80 md:text-2xl">
                Book a call quickly and easily with our custom scheduling and availability solution.
                You choose the date and time that works best for you.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <Image
                src="/calendar_picking.svg"
                alt="Calendar Picking Illustration"
                width={500}
                height={375}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="bg-[#fef9e3] py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-5xl font-bold text-[#3e516e] md:text-6xl">Chat</h2>
              <p className="text-xl font-medium leading-relaxed text-[#3e516e]/80 md:text-2xl">
                The best way to learn about a school is to talk to current students. If you don't
                have many questions our advisors come prepared with a slideshow to get the ball
                rolling.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <Image
                src="/chatting.svg"
                alt="Chat Illustration"
                width={500}
                height={375}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3e516e] py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Image
              src="/WordLogo.svg"
              alt="Peared Logo"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <p className="mt-2 font-medium text-[#fef9e3]">
            Copyright © 2024 • contact us at hello@peared.org
          </p>
        </div>
      </footer>
    </div>
  );
}
