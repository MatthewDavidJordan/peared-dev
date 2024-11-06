// SignUpForm.tsx
'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import { useRouter } from 'next/navigation';
import { getStudentIdByUserId } from '@/lib/queries';

function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
}

function RequiredFieldError() {
  return <p className="flex items-center gap-1 text-sm text-red-600">This field is required</p>;
}

// API call to request user creation or OTP verification
async function createUser(email: string, first_name: string, last_name: string) {
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email, first_name, last_name }),
  });
  return res.json();
}

// API call to create a meeting
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
    }),
  });
  return res.json();
}

export default function SignUpForm({
  advisorId,
  selectedTime,
  setSelectedTime,
  onOtpRequired,
}: {
  advisorId: number;
  selectedTime: Date | null;
  setSelectedTime: (value: Date | null) => void;
  onOtpRequired: (email: string) => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRequiredFieldErrors, setShowRequiredFieldErrors] = useState(false);

  const canConfirm =
    selectedTime && isEmailValid(email) && first_name.length > 0 && last_name.length > 0;

  const confirm = useCallback(async () => {
    if (!canConfirm) {
      return setShowRequiredFieldErrors(true);
    }

    try {
      setIsLoading(true);

      const response = await createUser(email, first_name, last_name);
      // response is either { otpSent: true } or { user: AuthUser }

      if (response.otpSent) {
        // Notify parent component (BookCard) that OTP is required
        // log that we are calling onOtpRequired in SignUpForm.tsx
        console.log('calling onOtpRequired in SignUpForm.tsx');
        onOtpRequired(email); // Pass the email when OTP is required
      } else if (response.user) {
        // we already have this student being tracked, so we can create the meeting
        const student: Awaited<ReturnType<typeof getStudentIdByUserId>> =
          await getStudentIdByUserId(response.user.user_id);

        // Define the start and end times for the meeting
        const startTime = selectedTime.toISOString();
        const endTime = new Date(
          selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS,
        ).toISOString();

        const meeting = await createMeeting(advisorId, student.student_id, startTime, endTime);
        router.push(`/meeting/${meeting.meeting_id}`);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error creating user or meeting:', error);
      setIsLoading(false);
    }
  }, [advisorId, canConfirm, email, first_name, last_name, router, selectedTime, onOtpRequired]);

  return (
    <div className="lg:!h-96 lg:!w-96">
      <div className="flex h-full flex-col gap-4 px-5 py-4">
        <label>Email *</label>
        <Input
          placeholder="example@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!!showRequiredFieldErrors && !isEmailValid(email) && <RequiredFieldError />}

        <label>First Name *</label>
        <Input
          placeholder="John"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {!!showRequiredFieldErrors && first_name.length === 0 && <RequiredFieldError />}

        <label>Last Name *</label>
        <Input
          placeholder="Smith"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />
        {!!showRequiredFieldErrors && last_name.length === 0 && <RequiredFieldError />}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedTime(null)} disabled={isLoading}>
            Back
          </Button>
          <Button
            onClick={confirm}
            className="relative"
            disabled={isLoading}
            variant="primaryToAccent"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
