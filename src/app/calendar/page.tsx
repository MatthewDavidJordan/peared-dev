'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/funcs';
import type { Setter } from '@/lib/types';
import { useMemo, useState, type ReactNode } from 'react';

export default function CalendarPage() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  return (
    <div className="flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center">
      <div
        // TODO: transition dimensions
        className={cn('flex items-stretch divide-x rounded-md border shadow-lg')}
      >
        {!selectedTime ? (
          <TimeForm selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        ) : (
          <div>
            <div className="flex flex-col gap-4 px-4 py-3">
              <Labelled label="Your name:">
                <Input placeholder="..." />
              </Labelled>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedTime(null)}>
                  Back
                </Button>
                <Button>Confirm</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Labelled({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function TimeForm({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: Date | null;
  setSelectedTime: Setter<Date | null>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const dates = [new Date(1728068027), new Date(1728018257)];
  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        onMonthChange={setSelectedDate}
      />
      <div>
        <div className="flex h-full flex-col gap-2 p-4">
          {dates.map((date, i) => (
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
