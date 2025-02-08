import SignOutButton from '@/components/SignOutButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <div className="flex w-full justify-between gap-2 bg-primary py-3 pl-1 pr-3 [&>div]:flex [&>div]:items-center">
      <div>
        <Button variant="secondaryLink" asChild>
          <Link href="/">
            <Image
              src="/WordLogo.svg"
              alt="Peared Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </Button>
        <Button variant="secondaryLink" asChild className="font-light">
          <Link href="/about">About</Link>
        </Button>
        <Button variant="secondaryLink" asChild className="font-light">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
      <SignOutButton />
      {/* <div>
        <Button variant="secondaryLink" asChild className="font-light">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div> */}
    </div>
  );
}
