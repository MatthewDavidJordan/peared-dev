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
    </div>
  );
}

function Hero() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-10 py-20">
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
    <section className="max-w- grid grid-cols-3 gap-10 px-10">
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
