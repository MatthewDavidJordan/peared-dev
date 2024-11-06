import NavBar from '@/components/NavBar';
import { getAllColleges, type College } from '@/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/funcs';

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <Hero />
      <SchoolSection />
      <div className="flex-1" />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-10 py-20 text-center">
      <h1 className="text-5xl font-bold">Discover Your Perfect College Fit</h1>
      <p className="text-lg text-muted-foreground">
        Connect with real students. Get authentic insights. Make informed decisions.
      </p>
    </div>
  );
}

async function SchoolSection() {
  const schools = await getAllColleges();

  if (!schools || schools.length === 0) {
    return (
      <section className="container mx-auto p-5 text-center">
        <p className="text-lg text-muted-foreground">No schools available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto grid grid-cols-1 gap-10 p-5 !pt-0 sm:grid-cols-2 sm:p-10 lg:grid-cols-3">
      {schools.map((school) =>
        school ? <SchoolCard key={school.school_id} school={school} /> : null,
      )}
    </section>
  );
}

interface SchoolCardProps {
  school: NonNullable<College>;
}

function SchoolCard({ school }: SchoolCardProps) {
  if (!school || !school.school_id) {
    return null;
  }

  return (
    <Link
      href={`/school/${school.school_id}`}
      className={cn(
        'block overflow-hidden rounded-lg border bg-white shadow-lg',
        'transition-transform duration-300 hover:scale-105',
      )}
    >
      <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-white p-4">
        {school.school_image ? (
          <Image
            src={school.school_image}
            alt={`${school.school_name || 'School'} logo`}
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            fill
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
            {school.school_name || 'School Name Unavailable'}
          </div>
        )}
      </div>
      <div className="border-t bg-white p-4">
        <h3 className="font-semibold">{school.school_name || 'School Name Unavailable'}</h3>
      </div>
    </Link>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary py-5 text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center">
        <p className="flex items-center gap-2">
          <Link href="/" className="font-bold hover:opacity-80">
            PearEd
          </Link>
          <span className="font-light text-primary-foreground/70">Copyright © {currentYear}</span>
        </p>
      </div>
    </footer>
  );
}
