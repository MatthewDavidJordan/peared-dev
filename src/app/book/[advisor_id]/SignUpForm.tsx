// SignUpForm.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';
import { createSupabaseClient } from '@/lib/supabase';
import { useCallback, useState } from 'react';

function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
}

function RequiredFieldError() {
  return <p className="flex items-center gap-1 text-sm text-red-600">This field is required</p>;
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
    cache: 'no-cache',
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
  onSignIn,
}: {
  advisorId: number;
  selectedTime: Date | null;
  setSelectedTime: (value: Date | null) => void;
  onSignIn: (email: string) => void;
}) {
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRequiredFieldErrors, setShowRequiredFieldErrors] = useState(false);

  const canConfirm =
    selectedTime && isEmailValid(email) && first_name.length > 0 && last_name.length > 0;

  const { createStudent } = useAuth();

  const confirm = useCallback(async () => {
    if (!canConfirm) {
      return setShowRequiredFieldErrors(true);
    }

    try {
      setIsLoading(true);

      await supabase.auth.signInWithOtp({
        email,
      });

      console.log('calling onOtpRequired in SignUpForm.tsx');
      onSignIn(email);

      setIsLoading(false);
    } catch (error) {
      console.error('Error creating user or meeting:', error);
      setIsLoading(false);
    }
  }, [canConfirm, supabase.auth, email, onSignIn]);

  return (
    <div className="flex w-full flex-col lg:flex-row">
      <div className="lg:!min-h-96 lg:!w-96">
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
    </div>
  );
}
