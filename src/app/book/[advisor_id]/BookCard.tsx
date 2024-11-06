'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';
import {
  type AvailabilityEvent,
  type Student,
  type getAdvisorById,
  type getCollegeById,
} from '@/lib/queries';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import AdvisorPreview from './AdvisorPreview';
import SignUpForm from './SignUpForm';
import TimeForm from './TimeForm';
import OtpCard from './OtpCard';
import { useCallback, useState } from 'react';

interface BookCardProps {
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
  school: Awaited<ReturnType<typeof getCollegeById>>;
}

interface BookingState {
  availabilities: AvailabilityEvent[];
  isLoading: boolean;
  otpEmail: string;
  showOtp: boolean;
}

export default function BookCard({ advisor, school }: BookCardProps) {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  const [bookingState, setBookingState] = useState<BookingState>({
    availabilities: [],
    isLoading: true,
    otpEmail: '',
    showOtp: false,
  });

  // Fetch availability data
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const response = await fetch(`/api/availability/${advisor.advisor_id}`);
        if (!response.ok) throw new Error('Failed to fetch availability');

        const data = await response.json();
        setBookingState((prev) => ({
          ...prev,
          availabilities: data.availabilityEvents,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching availability:', error);
        router.push('/404');
      }
    }

    fetchAvailability();
  }, [advisor.advisor_id, router]);

  // API handlers
  const createStudent = async (userId: number): Promise<Student> => {
    const response = await fetch('/api/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create student');
    }

    return response.json();
  };

  const createMeeting = async (studentId: number, startTime: string, endTime: string) => {
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        advisor_id: advisor.advisor_id,
        student_id: studentId,
        start_time: startTime,
        end_time: endTime,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create meeting');
    }

    return response.json();
  };

  // Event handlers
  const handleOtpRequired = useCallback((email: string) => {
    setBookingState((prev) => ({
      ...prev,
      otpEmail: email,
      showOtp: true,
    }));
  }, []);

  const handleOtpVerified = useCallback(
    async (userId: number) => {
      try {
        if (!selectedTime) {
          throw new Error('No time selected');
        }

        // Create the student record
        const student = await createStudent(userId);

        // Calculate meeting times
        const startTime = selectedTime.toISOString();
        const endTime = new Date(
          selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS,
        ).toISOString();

        // Create the meeting
        const meeting = await createMeeting(student.student_id, startTime, endTime);

        // Reset OTP state and redirect
        setBookingState((prev) => ({ ...prev, showOtp: false }));
        router.push(`/meeting/${meeting.meeting_id}`);
      } catch (error) {
        console.error('Error processing OTP verification:', error);
        // Here you might want to show an error message to the user
      }
    },
    [selectedTime, router],
  );

  if (bookingState.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading availability...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-stretch divide-y rounded-md border shadow-lg lg:flex-row lg:divide-x lg:divide-y-0 [&>*]:lg:w-72',
      )}
    >
      <AdvisorPreview advisor={advisor} school={school} />

      {!selectedTime ? (
        <TimeForm
          availabilities={bookingState.availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      ) : (
        <div className="flex w-full flex-col lg:flex-row">
          <SignUpForm
            advisorId={advisor.advisor_id}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onOtpRequired={handleOtpRequired}
          />
          {bookingState.showOtp && (
            <OtpCard email={bookingState.otpEmail} onVerified={handleOtpVerified} />
          )}
        </div>
      )}
    </div>
  );
}
