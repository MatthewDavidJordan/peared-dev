'use client';
import MeetingQuestionnaire from '@/app/book/[advisor_id]/MeetingQuestionnaire';
import NewUserQuestionnaire from '@/app/book/[advisor_id]/NewUserQuestionnaire';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import {
  type AvailabilityEvent,
  type Student,
  type getAdvisorById,
  type getCollegeById,
} from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdvisorPreview from './AdvisorPreview';
import OtpCard from './OtpCard';
import SignUpForm from './SignUpForm';
import TimeForm from './TimeForm';

// API client functions
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

const createMeeting = async (params: {
  advisorId: number;
  studentId: number;
  startTime: string;
  endTime: string;
}) => {
  const response = await fetch('/api/meetings', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      advisor_id: params.advisorId,
      student_id: params.studentId,
      start_time: params.startTime,
      end_time: params.endTime,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create meeting');
  }

  return response.json();
};

const fetchAvailability = async (advisorId: number): Promise<AvailabilityEvent[]> => {
  const response = await fetch(`/api/availability/${advisorId}`);
  if (!response.ok) throw new Error('Failed to fetch availability');
  const data = await response.json();
  return data.availabilityEvents;
};

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

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const availabilityEvents = await fetchAvailability(advisor.advisor_id);
        setBookingState((prev) => ({
          ...prev,
          availabilities: availabilityEvents,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching availability:', error);
        router.push('/404');
      }
    };

    loadAvailability();
  }, [advisor.advisor_id, router]);

  const handleOtpRequired = useCallback((email: string) => {
    setBookingState((prev) => ({
      ...prev,
      otpEmail: email,
      showOtp: true,
    }));
  }, []);

  const handleOtpVerified = useCallback(
    async (userId: number) => {
      if (!selectedTime) {
        throw new Error('No time selected');
      }

      // Create the student record
      const student = await createStudent(userId);

      // Calculate meeting times
      const startTime = selectedTime.toISOString();
      const endTime = new Date(selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS).toISOString();

      // Create the meeting
      const meeting = await createMeeting({
        advisorId: advisor.advisor_id,
        studentId: student.student_id,
        startTime,
        endTime,
      });

      // Reset OTP state and redirect
      setBookingState((prev) => ({ ...prev, showOtp: false }));
      router.push(`/meeting/${meeting.meeting_id}`);
    },
    [advisor.advisor_id, router, selectedTime],
  );

  const rightPanel = useMemo(() => {
    return <NewUserQuestionnaire />;
    if (!selectedTime)
      return (
        <TimeForm
          availabilities={bookingState.availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      );
    else if (!bookingState.showOtp)
      return (
        <SignUpForm
          advisorId={advisor.advisor_id}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onOtpRequired={handleOtpRequired}
        />
      );
    // TODO: we need a better state system for what screen to show
    else if (false)
      return <MeetingQuestionnaire advisor={advisor} schoolName={school.school_name} />;
    else if (false) return <NewUserQuestionnaire />;
    else return <OtpCard email={bookingState.otpEmail} onVerified={handleOtpVerified} />;
  }, [
    advisor,
    bookingState.availabilities,
    bookingState.otpEmail,
    bookingState.showOtp,
    handleOtpRequired,
    handleOtpVerified,
    school.school_name,
    selectedTime,
    setSelectedTime,
  ]);

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

      {rightPanel}
    </div>
  );
}
