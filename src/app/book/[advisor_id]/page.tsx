'use client';
import NavBar from '@/components/NavBar';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { FALLBACK_IMAGE } from '@/lib/consts';
import { cn, onSameDay } from '@/lib/funcs';
import { type getAdvisorById } from '@/lib/queries';
import type { Setter } from '@/lib/types';
import { Clock, Globe, Info, LoaderCircle, Undo2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
}

function RequiredFieldError() {
  return (
    <p className="flex items-center gap-1 text-sm text-red-600">
      <Info className="size-3" />
      This field is required{' '}
    </p>
  );
}

export default function CalendarPage() {
  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex w-full flex-1 flex-col items-center justify-center [&>*>*]:w-72">
        <div
          // TODO: transition dimensions
          className={cn('flex items-stretch divide-x rounded-md border shadow-lg')}
        >
          <AdvisorPreview
            advisor={{
              ical_link: '',
              advisor_id: 0,
              advisor_image: '/leo.png',
              advisor_name: 'Leo',
              availability_id: null,
              bio: 'Georgetown SFS student with a strong passion for public service, technology, and where they intersect. Background in software development, technical recruiting, consulting, and emergency response.',
              payment_info_id: null,
              school_id: 1,
              user_id: '',
              school_name: 'Georgetown University',
              school_image: '/georgetown.png',
              advisor_labels: [],
            }}
          />
          {!selectedTime ? (
            <TimeForm selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
          ) : (
            <SignUpForm selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
          )}
        </div>
      </div>
    </div>
  );
}

function SignUpForm({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const canConfirm = selectedTime && isEmailValid(email);
  const [showRequiredFieldErrors, setShowRequiredFieldErrors] = useState(false);
  const confirm = useCallback(async () => {
    if (!canConfirm) return setShowRequiredFieldErrors(true);

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`/meeting/${1}`);
    } catch {
      setIsLoading(false);
    }
  }, [canConfirm, router]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-full min-w-64 flex-col gap-4 px-5 py-4">
        <Labelled label="Email *">
          <Input
            placeholder="example@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!!showRequiredFieldErrors && <RequiredFieldError />}
        </Labelled>
        <Labelled label="Name">
          <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        </Labelled>
        <div className="flex-1" />
        <p className="text-xs font-light text-zinc-500">
          By proceeding you agree to our{' '}
          <Link href="/tos" className="underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedTime(null)} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={confirm} className="relative" disabled={isLoading}>
            <span className={cn(isLoading && 'invisible')}>Confirm</span>
            {isLoading && (
              <LoaderCircle className="absolute left-auto right-auto size-4 animate-spin" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdvisorPreview({ advisor }: { advisor: Awaited<ReturnType<typeof getAdvisorById>> }) {
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
          {/* TODO: */}
          <span>15 min</span>
        </p>
        <p className="flex items-center gap-1 text-sm">
          <Globe className="size-4" />
          {/* TODO: */}
          <span>America/New York</span>
        </p>
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function TimeForm({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const dates = useMemo(() => [new Date(1728068027000), new Date(1729129857000)], []);
  useEffect(() => {
    if (!selectedDate) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      return !dates.some((d) => onSameDay(d, date));
    },
    [dates],
  );
  const selectedDayTimes = useMemo(() => {
    if (!selectedDate) return [];
    return dates.filter((d) => onSameDay(d, selectedDate));
  }, [dates, selectedDate]);

  return (
    <>
      <Calendar
        className="!w-auto"
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={isDateDisabled}
        today={undefined}
      />
      <div>
        <div className="flex h-full flex-col gap-2 p-4">
          <p className="inline-flex items-end gap-1.5">
            <b>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(selectedDate)}</b>
            <span className="rounded bg-secondary px-1 font-mono text-secondary-foreground">
              {new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(selectedDate)}
            </span>
          </p>
          {selectedDayTimes.map((date, i) => (
            <TimeSlot key={i} date={date} onClick={() => setSelectedTime(date)} />
          ))}
        </div>
      </div>
    </>
  );
}

function TimeSlot({ date, ...props }: { date: Date } & ButtonProps) {
  const dateString = useMemo(
    () =>
      date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [date],
  );
  return (
    <Button variant="outline" className="min-w-32" {...props}>
      {dateString}
    </Button>
  );
}
