'use client';
import MeetingQuestionnaire, {
  type MeetingForm,
} from '@/app/book/[advisor_id]/MeetingQuestionnaire';
import NewUserQuestionnaire from '@/app/book/[advisor_id]/NewUserQuestionnaire';
import { Button } from '@/components/ui/button';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { cn } from '@/lib/funcs';
import { useAuth } from '@/lib/hooks/useAuth';
import { type AvailabilityEvent, type getAdvisorById, type getCollegeById } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdvisorPreview from './AdvisorPreview';
import OtpCard from './OtpCard';
import SignUpForm from './SignUpForm';
import TimeForm from './TimeForm';

// API client functions

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
  const [confirmedAccount, setConfirmedAccount] = useState(false);

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

  const rightPanel = useMemo(() => {
    if (!selectedTime)
      return (
        <TimeForm
          availabilities={availabilities}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      );
    if (student && user?.email && !confirmedAccount)
      return <ConfirmAccount email={user.email} onContinue={() => setConfirmedAccount(true)} />;
    else if (student && !student?.completed_sign_up_form) return <NewUserQuestionnaire />;
    else if (student && user)
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
          onSignIn={(otpEmail) => {
            setOtpEmail(otpEmail);
            setConfirmedAccount(true);
          }}
        />
      );
    else return <OtpCard email={otpEmail} setOtpEmail={setOtpEmail} />;
  }, [
    advisor,
    availabilities,
    confirmedAccount,
    handleMeetingCreation,
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

function ConfirmAccount({ email, onContinue }: { email: string; onContinue: () => void }) {
  const { signOut } = useAuth();
  return (
    <div className="lg:!w-96">
      <div className="h-full lg:!min-h-96">
        <div className="flex h-full flex-col gap-4 px-5 py-4">
          <h3 className="self-center text-lg font-bold">Confirm Account</h3>
          <p>
            Do you want to book the meeting with the email:{' '}
            <code className="rounded bg-primary/10 px-1 py-0.5">{email}</code>
          </p>
          <div className="flex-1"></div>
          <div className="flex justify-end gap-2">
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
            <Button onClick={onContinue}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
