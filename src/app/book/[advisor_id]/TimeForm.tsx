'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DEFAULT_MEETING_DURATION_MS } from '@/lib/consts';
import { onSameDay } from '@/lib/funcs';
import type { AvailabilityEvent } from '@/lib/queries';
import type { Setter } from '@/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function TimeForm({
  selectedTime,
  setSelectedTime,
  availabilities,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
  availabilities: AvailabilityEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const dates = useMemo(() => {
    return availabilities.flatMap((item) => {
      // break start_time and end_time into chunks of size DEFAULT_MEETING_DURATION_MS
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);
      const duration = DEFAULT_MEETING_DURATION_MS;
      const times = [];
      for (let t = start.getTime(); t < end.getTime(); t += duration) {
        times.push(new Date(t));
      }
      return times;
    });
  }, [availabilities]);

  useEffect(() => {
    if (!selectedDate) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      return !dates.some((d) => onSameDay(d, date));
    },
    [dates],
  );
  const selectedDayTimes = useMemo(() => {
    if (!selectedDate) return [];
    return dates.filter((d) => onSameDay(d, selectedDate));
  }, [dates, selectedDate]);

  return (
    <>
      <Calendar
        className="!w-auto"
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={isDateDisabled}
        today={undefined}
      />
      <div className="flex h-[454px] flex-col gap-2 p-4">
        <p className="inline-flex items-end gap-1.5">
          <b>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(selectedDate)}</b>
          <span className="rounded bg-secondary px-1 font-mono text-secondary-foreground">
            {new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(selectedDate)}
          </span>
        </p>
        <div className="flex h-full min-h-0 flex-grow-0 flex-col gap-2 overflow-scroll">
          {selectedDayTimes.map((date, i) => (
            <TimeSlot key={i} date={date} onClick={() => setSelectedTime(date)} />
          ))}
        </div>
      </div>
    </>
  );
}

function TimeSlot({ date, ...props }: { date: Date } & ButtonProps) {
  const startTimeString = useMemo(
    () =>
      date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [date],
  );
  const endTimeString = useMemo(
    () =>
      new Date(date.getTime() + DEFAULT_MEETING_DURATION_MS).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [date],
  );
  return (
    <Button variant="outline" className="min-w-32" {...props}>
      {startTimeString}{' '}
      <span className="px-2 text-primary/50 group-hover:text-accent-foreground/50">–</span>{' '}
      {endTimeString}
    </Button>
  );
}
