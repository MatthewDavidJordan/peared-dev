'use client';
import { DEFAULT_MEETING_DURATION_MS, FALLBACK_IMAGE } from '@/lib/consts';
import { type getAdvisorById } from '@/lib/queries';
import { Clock, Globe, Undo2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdvisorPreview({
  advisor,
}: {
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
}) {
  const meetingLengthMinString = Math.round(DEFAULT_MEETING_DURATION_MS / 1000 / 60).toString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div>
      <div className="flex h-full flex-col gap-2 px-5 py-4">
        <Image
          src={advisor.advisor_image ?? FALLBACK_IMAGE}
          className="size-20 rounded-md"
          width={80}
          height={80}
          alt="advisor photo"
        />
        <h2 className="text-2xl font-bold">{advisor.advisor_name}</h2>
        <Link
          href={`/school/${advisor.school_id}`}
          className="flex items-center gap-1 font-extrabold text-blue-900 underline"
        >
          <Undo2 className="size-4 [&_*]:stroke-[3]" />
          {advisor.school_name}
        </Link>
        <p className="text-sm font-light text-zinc-600">{advisor.bio}</p>
        {/* TODO: labels */}
        <div className="flex-1" />
        <p className="flex items-center gap-1 text-sm">
          <Clock className="size-4" />
          <span>{meetingLengthMinString} min</span>
        </p>
        <p className="flex items-center gap-1 text-sm">
          <Globe className="size-4" />
          <span>{timeZone}</span>
        </p>
      </div>
    </div>
  );
}
