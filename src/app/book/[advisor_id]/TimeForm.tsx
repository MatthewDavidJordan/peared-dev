'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { onSameDay } from '@/lib/funcs';
import type { Setter } from '@/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function TimeForm({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const dates = useMemo(() => [new Date(1728068027000), new Date(1729129857000)], []);
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
      <div>
        <div className="flex h-full flex-col gap-2 p-4">
          <p className="inline-flex items-end gap-1.5">
            <b>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(selectedDate)}</b>
            <span className="rounded bg-secondary px-1 font-mono text-secondary-foreground">
              {new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(selectedDate)}
            </span>
          </p>
          {selectedDayTimes.map((date, i) => (
            <TimeSlot key={i} date={date} onClick={() => setSelectedTime(date)} />
          ))}
        </div>
      </div>
    </>
  );
}

function TimeSlot({ date, ...props }: { date: Date } & ButtonProps) {
  const dateString = useMemo(
    () =>
      date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [date],
  );
  return (
    <Button variant="outline" className="min-w-32" {...props}>
      {dateString}
    </Button>
  );
}
