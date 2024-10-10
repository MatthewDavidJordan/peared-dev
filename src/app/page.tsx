import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
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

function NavBar() {
  return (
    <div className="flex w-full justify-between gap-2 bg-primary py-3 pl-1 pr-3 [&>div]:flex [&>div]:items-center">
      <div>
        <Button variant="secondaryLink" asChild>
          <Link href="/">
            <h2 className="font-serif text-lg font-bold">College Compass</h2>
          </Link>
        </Button>
        <Button variant="secondaryLink" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button variant="secondaryLink" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
      <div>
        <Button variant="secondaryLink" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-10 py-20">
      <h1 className="text-5xl font-bold">Discover Your Perfect College Fit</h1>
      <p>Connect with real students. Get authentic insights. Make informed decisions.</p>
      <Button asChild>
        <Link href="/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}

function SchoolSection() {
  const schools = Array(3).fill(null);
  return (
    <section className="max-w- grid grid-cols-3 gap-10 px-10">
      {schools.map((_, i) => (
        <SchoolCard key={i} />
      ))}
    </section>
  );
}

function SchoolCard() {
  return (
    <Link href="/school">
      <Card className="border-none bg-primary text-primary-foreground">
        <Image
          src="https://thomasforbes.com/wine.png"
          alt="school photo"
          width={300}
          height={200}
          className="aspect-[3/2] w-full object-cover"
        />
        <CardHeader className="p-4">
          <CardTitle>Georgetown</CardTitle>
          <CardDescription className="text-muted">Washington DC</CardDescription>
        </CardHeader>
        {/* <CardContent className="p-4 pt-0">
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </Link>
  );
}
