// BookCard.tsx
'use client';
import AdvisorPreview from '@/app/book/[advisor_id]/AdvisorPreview';
import SignUpForm from '@/app/book/[advisor_id]/SignUpForm';
import TimeForm from '@/app/book/[advisor_id]/TimeForm';
import OtpCard from '@/app/book/[advisor_id]/OtpCard';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import { useState } from 'react';
import type { getAdvisorAvailability, getAdvisorById, getCollegeById } from '@/lib/queries';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';
import router from 'next/router';
import { Student } from '@/lib/queries';

export default function BookCard({
  advisor,
  school,
  availabilities,
}: {
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
  school: Awaited<ReturnType<typeof getCollegeById>>;
  availabilities: Awaited<ReturnType<typeof getAdvisorAvailability>>;
}) {
  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  const [otpRequired, setOtpRequired] = useState(false); // State to track OTP requirement
  const [email, setEmail] = useState(''); // Store the email used for OTP
  const [studentId, setStudentId] = useState<number | null>(null);

  const handleOtpRequired = (email: string) => {
    console.log('OTP required for email:', email);
    setEmail(email); // Set the email for OTP verification
    setOtpRequired(true); // Trigger OTP card display
  };

  const handleOtpVerified = async (user_id: number) => {
    console.log('OTP verified successfully');
    setOtpRequired(false); // Hide OTP card upon successful verification

    // now call api/student/create to create a student or see if they exist
    try {
      const res = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id,
        }),
      });
      const student: Student = await res.json();

      // Define the start and end times for the meeting
      const startTime = selectedTime?.toISOString();
      const endTime = selectedTime
        ? new Date(selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS).toISOString()
        : '';

      // console log the meeting details
      console.log('Creating meeting:', {
        advisorId: advisor.advisor_id,
        studentId: student.student_id,
        startTime,
        endTime,
      });

      // Create a meeting for the verified student
      try {
        const res = await fetch('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            advisorId: advisor.advisor_id,
            studentId,
            startTime,
            endTime,
          }),
        });
        const meeting = await res.json();

        // Navigate to the meeting page upon successful creation
        if (meeting) {
          router.push(`/meeting/${meeting.meeting_id}`);
        } else {
          console.error('Failed to create meeting');
        }
      } catch (error) {
        console.error('Error creating meeting:', error);
      }
    } catch (error) {
      console.error('Error creating student after OTP verification:', error);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-stretch divide-y rounded-md border shadow-lg lg:flex-row lg:divide-x lg:divide-y-0 [&>*]:lg:w-72',
      )}
    >
      <AdvisorPreview advisor={advisor} school={school} />
      {!selectedTime ? (
        <TimeForm
          availabilities={availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      ) : (
        <div className="flex w-full flex-col lg:flex-row">
          <SignUpForm
            advisorId={advisor.advisor_id}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onOtpRequired={handleOtpRequired} // Trigger OTP on requirement
          />
          {otpRequired && (
            <OtpCard
              email={email}
              onVerified={handleOtpVerified} // Handle successful OTP verification
            />
          )}
        </div>
      )}
    </div>
  );
}
