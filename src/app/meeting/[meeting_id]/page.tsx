import { AdvisorLabels } from '@/app/book/[advisor_id]/AdvisorPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FALLBACK_IMAGE, SUPPORT_MAILTO } from '@/lib/consts';
import { getAdvisorById, getMeetingById } from '@/lib/queries';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

function generateWhenString(start_time: string, end_time: string) {
  const dateString = new Date(start_time).toLocaleDateString();

  const startTimeString = new Date(start_time).toLocaleTimeString();
  const endTimeString = new Date(end_time).toLocaleTimeString();

  return `${dateString} ${startTimeString} - ${endTimeString}`;
}

export default async function MeetingPage({
  params: { meeting_id },
}: {
  params: { meeting_id: string };
}) {
  const meeting = await getMeetingById(Number(meeting_id));
  if (!meeting) redirect('/404');

  const advisor = await getAdvisorById(meeting.advisor_id!);
  if (!advisor) redirect('/404');

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-3 sm:p-10">
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
        <CardContent className="flex flex-col gap-4 !pt-0 sm:p-8">
          <div className="flex flex-col items-center gap-3 py-5 text-center">
            <h1 className="text-2xl font-bold">🎉&nbsp;Your meeting is scheduled&nbsp;🎉</h1>
            <p className="text-secondary-foreground">
              We sent you an email and calendar invitation with the details
            </p>
          </div>

          <hr />

          <div className="grid grid-cols-3 gap-y-2 text-sm sm:text-base">
            {[
              { left: 'Who', right: advisor.advisor_name },
              { left: 'When', right: generateWhenString(meeting.start_time, meeting.end_time) },
              {
                left: 'Where',
                right: (
                  <Link href="/meeting-link" className="inline-flex items-center gap-1.5 underline">
                    Link
                    <ExternalLink className="size-4" />
                  </Link>
                ),
              },
            ].map((item, index) => (
              <Fragment key={index}>
                <p className="font-semibold">{item.left}</p>
                <p className="col-span-2">{item.right}</p>
              </Fragment>
            ))}
          </div>

          <hr />

          <p className="py-4 text-center">
            Need to make a change?{' '}
            <Link href={SUPPORT_MAILTO} className="underline">
              Contact&nbsp;support
            </Link>
          </p>

          <hr />

          <h2 className="text-2xl font-bold">{advisor.advisor_name}</h2>
          <p className="text-sm font-light text-zinc-600">{advisor.bio}</p>
          <AdvisorLabels advisor_labels={advisor.advisor_labels} />

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
