'use client';
import AdvisorPreview from '@/app/book/[advisor_id]/AdvisorPreview';
import SignUpForm from '@/app/book/[advisor_id]/SignUpForm';
import TimeForm from '@/app/book/[advisor_id]/TimeForm';
import { cn } from '@/lib/funcs';
import type { AvailabilityEvent, getAdvisorById } from '@/lib/queries';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';

export default function BookCard({
  advisor,
  availabilities,
}: {
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
  availabilities: AvailabilityEvent[];
}) {
  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  return (
    <div
      // TODO: transition dimensions
      className={cn(
        'flex flex-col items-stretch divide-y rounded-md border shadow-lg lg:flex-row lg:divide-x lg:divide-y-0 [&>*]:lg:w-72',
      )}
    >
      <AdvisorPreview advisor={advisor} />
      {!selectedTime ? (
        <TimeForm
          availabilities={availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      ) : (
        <SignUpForm
          advisorId={advisor.advisor_id}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      )}
    </div>
  );
}
