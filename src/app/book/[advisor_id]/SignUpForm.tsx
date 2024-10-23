'use client';
import type { CreateMeetingRequest } from '@/app/api/meetings/route';
import type { CreateUserRequest } from '@/app/api/users/route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import { type Meeting, type Student } from '@/lib/queries';
import type { Setter } from '@/lib/types';
import type { AuthResponse } from '@supabase/supabase-js';
import { Info, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState, type ReactNode } from 'react';

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

async function createUser(email: string, name: string) {
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email, name } satisfies CreateUserRequest),
  });
  const data: { user: AuthResponse; student: Student } = await res.json();
  return data;
}

async function createMeeting(
  advisor_id: number,
  student_id: number,
  start_time: string,
  end_time: string,
) {
  const res = await fetch('/api/meetings', {
    method: 'POST',
    body: JSON.stringify({
      advisor_id,
      student_id,
      start_time,
      end_time,
    } satisfies CreateMeetingRequest),
  });
  const data: Meeting = await res.json();
  return data;
}

export default function SignUpForm({
  advisorId,
  selectedTime,
  setSelectedTime,
}: {
  advisorId: number;
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const canConfirm = selectedTime && isEmailValid(email) && name.length > 0;
  const [showRequiredFieldErrors, setShowRequiredFieldErrors] = useState(false);

  const confirm = useCallback(async () => {
    if (!canConfirm) return setShowRequiredFieldErrors(true);

    try {
      setIsLoading(true);

      const { student } = await createUser(email, name);

      const startTime = selectedTime.toISOString();
      const endTime = new Date(selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS).toISOString();

      const meeting = await createMeeting(advisorId, student.student_id, startTime, endTime);

      router.push(`/meeting/${meeting.meeting_id}`);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [advisorId, canConfirm, email, name, router, selectedTime]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="lg:!h-96 lg:!w-96">
      <div className="flex h-full flex-col gap-4 px-5 py-4">
        <Labelled label="Email *">
          <Input
            placeholder="example@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!!showRequiredFieldErrors && !isEmailValid(email) && <RequiredFieldError />}
        </Labelled>
        <Labelled label="Name *">
          <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          {!!showRequiredFieldErrors && name.length === 0 && <RequiredFieldError />}
        </Labelled>
        <div className="flex-1" />
        <p className="self-end text-xs font-light text-zinc-500">
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
          <Button
            onClick={confirm}
            className="relative"
            disabled={isLoading}
            variant="primaryToAccent"
          >
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

function Labelled({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}
