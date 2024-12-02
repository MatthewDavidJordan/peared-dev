'use client';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/lib/hooks/useAuth';
import { createSupabaseClient } from '@/lib/supabase';
import type { Setter } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

interface OtpCardProps {
  email: string;
  setOtpEmail: Setter<string | null>;
}

interface VerifyOtpResponse {
  user: {
    user_id: number;
    [key: string]: any;
  };
}

export default function OtpCard({ email, setOtpEmail }: OtpCardProps) {
  const supabase = createSupabaseClient();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { createStudent } = useAuth();

  const handleOtpSubmit = useCallback(async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const {
        data: { user, session },
      } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (!user || !session) throw new Error('');

      console.log('bal');

      await createStudent(user.id);
      console.log('done');

      setOtpEmail(null);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'An error occurred while verifying the OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [otp, supabase.auth, email, createStudent, setOtpEmail]);

  useEffect(() => {
    if (otp.length === 6) handleOtpSubmit();
  }, [handleOtpSubmit, otp.length]);

  return (
    <div>
      <div className="flex h-full flex-col gap-5 px-5 py-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Enter OTP</h3>
          <p className="text-sm text-zinc-600">
            We&apos;ve sent you an email with 6 digit code. Enter that code here
          </p>
        </div>
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          onClick={handleOtpSubmit}
          disabled={isLoading || otp.length < 6}
          variant="primaryToAccent"
          className="w-full"
        >
          {isLoading ? 'Verifying...' : 'Submit OTP'}
        </Button>
      </div>
    </div>
  );
}
