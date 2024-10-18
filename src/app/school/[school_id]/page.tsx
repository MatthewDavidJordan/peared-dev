import { AdvisorLabels } from '@/app/book/[advisor_id]/AdvisorPreview';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { FALLBACK_IMAGE } from '@/lib/consts';
import { getAdvisorsForCollege } from '@/lib/queries';
import Image from 'next/image';
import Link from 'next/link';

export default async function CollegePage({
  params: { school_id },
}: {
  params: { school_id: string };
}) {
  const advisors = await getAdvisorsForCollege(Number(school_id));

  return (
    <div className="min-h-screen w-full">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-5xl font-bold">Georgetown</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {advisors.map((advisor) => (
            <AdvisorCard key={advisor.advisor_id} advisor={advisor} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdvisorCard({
  advisor,
}: {
  advisor: Awaited<ReturnType<typeof getAdvisorsForCollege>>[0];
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Image
        src={advisor.advisor_image ?? FALLBACK_IMAGE}
        alt={advisor.advisor_name}
        width={400}
        height={400}
        className="aspect-square min-h-64 w-full rounded-b-lg object-cover"
      />
      <CardTitle className="p-4">{advisor.advisor_name}</CardTitle>
      <CardContent className="flex-grow">
        <p className="mb-4 text-sm text-muted-foreground">{advisor.bio}</p>
        <AdvisorLabels advisor_labels={advisor.advisor_labels} />
      </CardContent>
      <CardFooter>
        <Button variant="primaryToAccent" className="w-full">
          <Link href={`/book/${advisor.advisor_id}`}>
            Book a Call with {advisor.advisor_name.split(' ')[0]}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
