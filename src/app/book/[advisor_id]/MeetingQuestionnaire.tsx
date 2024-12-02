'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { type getAdvisorById } from '@/lib/queries';
import { useCallback, useState } from 'react';

const reasons = [
  'Please select',
  'Application Help',
  'General School Overview',
  'ED/Commitment Decision Assistance',
  'Community and Culture Overview',
  'Nightlife and Social Scene Overview',
] as const;

export type MeetingForm = {
  college_familiarity: number;
  reason: string;
  extra_info: string;
};

export default function MeetingQuestionnaire({
  schoolName,
  advisor,
  onContinue,
}: {
  schoolName: string;
  advisor: Awaited<ReturnType<typeof getAdvisorById>>;
  onContinue: (meetingForm: MeetingForm) => Promise<void>;
}) {
  const [familiarity, setFamiliarity] = useState(3);
  const [reason, setReason] = useState<string>(reasons[0]);
  const [extraInfo, setExtraInfo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (reason === 'Please select') {
      setErrorMessage('Please select a valid reason for the call.');
      return;
    }

    setIsLoading(true);
    try {
      await onContinue({ college_familiarity: familiarity, reason, extra_info: extraInfo });
    } catch (e) {
      console.error(e);
      setErrorMessage('An error occurred while creating the meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [extraInfo, familiarity, onContinue, reason]);

  return (
    <div className="lg:!w-96">
      <div className="lg:!min-h-96">
        <div className="flex h-full flex-col gap-4 px-5 py-4">
          <label>How much do you know about {schoolName}? *</label>
          <div className="flex gap-3">
            <p>(Nothing) 0</p>
            <Slider
              value={[familiarity]}
              onValueChange={([value]) => setFamiliarity(value!)}
              max={5}
              step={1}
            />
            <p>5 (A lot!)</p>
          </div>
          <label>What is your main reason for the call? *</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label>
            Anything else you want to share with {advisor.profiles?.first_name ?? 'your advisor'}?
          </label>
          <Textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} />
          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClick}
              className="relative"
              disabled={isLoading}
              variant="primaryToAccent"
            >
              Confirm & Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
