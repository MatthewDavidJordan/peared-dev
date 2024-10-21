import NavBar from '@/components/NavBar';
import { getAllColleges, type College } from '@/lib/queries';
import Link from 'next/link';

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
      <p>Connect with real students. Get authentic insights. Make informed decisions.</p>
      {/* <Button asChild variant="accent">
        <Link href="/sign-up">Get Started</Link>
      </Button> */}
    </div>
  );
}

async function SchoolSection() {
  const schools = await getAllColleges();
  return (
    <section className="grid grid-cols-1 gap-10 p-5 !pt-0 sm:grid-cols-2 sm:p-10 lg:grid-cols-3">
      {schools.map((school) => (
        <SchoolCard key={school.school_id} school={school} />
      ))}
      {schools.map((school) => (
        <SchoolCard key={school.school_id} school={school} />
      ))}
      {schools.map((school) => (
        <SchoolCard key={school.school_id} school={school} />
      ))}
    </section>
  );
}

function SchoolCard({ school }: { school: College }) {
  return (
    <Link href={`/school/${school.school_id}`}>
      <img
        src="https://admissionscheckup.com/wp-content/uploads/2023/09/Georgetown-University-Logo.png"
        className="w-full rounded-lg border shadow-lg duration-300 hover:scale-105"
      />
    </Link>
  );
}

function Footer() {
  return (
    <div className="flex items-center justify-center bg-primary py-5 text-primary-foreground">
      <p className="flex items-center gap-2">
        <Link href="/">
          <span className="font-bold">PearEd</span>
        </Link>{' '}
        <span className="font-light text-primary-foreground/70">
          Copyright © {new Date().getFullYear()}
        </span>
      </p>
    </div>
  );
}
