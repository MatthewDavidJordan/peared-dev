import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FALLBACK_IMAGE } from '@/lib/consts';
import { getAdvisorById, getMeetingById } from '@/lib/queries';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MeetingPage({
  params: { meeting_id },
}: {
  params: { meeting_id: string };
}) {
  const meeting = await getMeetingById(Number(meeting_id));
  if (!meeting) redirect('/404');

  const advisor = await getAdvisorById(meeting.advisor_id!);
  if (!advisor) redirect('/404');

  console.log(meeting, advisor);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-10">
      <Card className="max-w-[500px] shadow-lg">
        <CardHeader>
          <Image
            src={advisor.advisor_image ?? FALLBACK_IMAGE}
            className="aspect-square w-full rounded-md"
            width={500}
            height={500}
            alt="advisor photo"
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-8 pt-0">
          <div className="flex flex-col items-center gap-3 py-5 text-center">
            <h1 className="text-2xl font-bold">🎉 Your meeting is scheduled 🎉</h1>
            <p className="text-secondary-foreground">
              We sent you an email and calendar invitation with the details
            </p>
          </div>

          <hr />

          <div className="grid grid-cols-3 gap-y-2">
            {[
              { left: 'Who', right: advisor.advisor_name },
              { left: 'When', right: new Date(meeting.start_time).toLocaleString() },
              {
                left: 'Where',
                right: (
                  <Link href="/meeting-link" className="inline-flex items-center gap-1.5 underline">
                    Link
                    <ExternalLink className="size-4" />
                  </Link>
                ),
              },
            ].map((item) => (
              <>
                <p className="font-semibold">{item.left}</p>
                <p className="col-span-2">{item.right}</p>
              </>
            ))}
          </div>

          <hr />

          <p className="py-4 text-center">
            Need to make a change?{' '}
            <Link href="mailto:support@peared.com" className="underline">
              Contact support
            </Link>
          </p>

          <hr />

          <h2 className="text-2xl font-bold">{advisor.advisor_name}</h2>
          <p className="text-sm font-light text-zinc-600">{advisor.bio}</p>
          {/* TODO: labels */}

          <hr />

          <div className="py-2">
            <Button variant="primaryToAccent" className="w-full">
              <Link href="/">Book another meeting</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
