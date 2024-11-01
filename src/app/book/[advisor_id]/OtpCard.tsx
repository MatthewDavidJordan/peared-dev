// OtpCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function OtpCard({
  email,
  onVerified,
}: {
  email: string;
  onVerified: (user_id: number) => void;
}) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  console.log(email);

  // Watch for the OTP reaching 6 characters and submit automatically
  useEffect(() => {
    if (otp.length === 6) {
      handleOtpSubmit();
    }
  }, [otp]);

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    console.log(email, otp);
    setErrorMessage(''); // Clear any previous error

    try {
      const res = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        onVerified(data.user.user_id);
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('An error occurred while verifying the OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Enter OTP</h3>
      <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}

      <Button
        onClick={handleOtpSubmit}
        disabled={isLoading || otp.length < 6}
        variant="primaryToAccent"
        className="mt-4"
      >
        {isLoading ? 'Verifying...' : 'Submit OTP'}
      </Button>
    </div>
  );
}
