'use client';
import MeetingQuestionnaire, {
  type MeetingForm,
} from '@/app/book/[advisor_id]/MeetingQuestionnaire';
import NewUserQuestionnaire from '@/app/book/[advisor_id]/NewUserQuestionnaire';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import { useAuth } from '@/lib/hooks/useAuth';
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
const createStudent = async (userId: string): Promise<Student> => {
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
  meetingForm: MeetingForm;
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
      meeting_form: params.meetingForm,
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

export default function BookCard({ advisor, school }: BookCardProps) {
  const router = useRouter();
  const { user, student } = useAuth();

  const [selectedTime, setSelectedTime] = useQueryState('time', parseAsIsoDateTime);
  const [isLoadingAvailabilities, setIsLoadingAvailabilities] = useState(true);
  const [availabilities, setAvailabilities] = useState<AvailabilityEvent[]>([]);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const availabilityEvents = await fetchAvailability(advisor.advisor_id);
        setAvailabilities(availabilityEvents);
        setIsLoadingAvailabilities(false);
      } catch (error) {
        console.error('Error fetching availability:', error);
        router.push('/404');
      }
    };

    loadAvailability();
  }, [advisor.advisor_id, router]);

  const handleMeetingCreation = useCallback(
    async (meetingForm: MeetingForm) => {
      if (!selectedTime || !student) throw new Error('Assumptions incorrect');

      // Calculate meeting times
      const startTime = selectedTime.toISOString();
      const endTime = new Date(selectedTime.getTime() + DEFAULT_MEETING_DURATION_MS).toISOString();

      // Create the meeting
      const meeting = await createMeeting({
        advisorId: advisor.advisor_id,
        studentId: student.student_id,
        startTime,
        endTime,
        meetingForm,
      });

      router.push(`/meeting/${meeting.meeting_id}`);
    },
    [advisor.advisor_id, router, selectedTime, student],
  );

  const handleOtpVerified = useCallback(async (userId: string) => {
    // Create the student record
    const student = await createStudent(userId);
    // await handleMeetingCreation(student);
    setOtpEmail(null);
  }, []);

  const rightPanel = useMemo(() => {
    if (!selectedTime)
      return (
        <TimeForm
          availabilities={availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      );
    // TODO: all other forms have button to go back to time form
    else if (student && !student?.completed_sign_up_form) return <NewUserQuestionnaire />;
    else if (user)
      return (
        <MeetingQuestionnaire
          advisor={advisor}
          schoolName={school.school_name}
          onContinue={handleMeetingCreation}
        />
      );
    else if (!otpEmail)
      return (
        <SignUpForm
          advisorId={advisor.advisor_id}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onOtpRequired={setOtpEmail}
        />
      );
    else return <OtpCard email={otpEmail} onVerified={handleOtpVerified} />;
  }, [
    advisor,
    availabilities,
    handleMeetingCreation,
    handleOtpVerified,
    otpEmail,
    school.school_name,
    selectedTime,
    setSelectedTime,
    student,
    user,
  ]);

  if (isLoadingAvailabilities) {
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
