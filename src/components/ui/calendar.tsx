'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-6', className)} // Increased padding for the entire calendar
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0', // More spacing between months
        month: 'space-y-6',
        caption: 'flex justify-center pt-2 relative items-center',
        caption_label: 'text-lg font-semibold', // Larger caption text
        nav: 'space-x-2 flex items-center', // Slightly larger space between nav buttons
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-8 sm:size-10 bg-transparent p-0 opacity-70 hover:opacity-100', // Bigger nav buttons
        ),
        nav_button_previous: 'absolute left-2',
        nav_button_next: 'absolute right-2',
        table: 'w-full border-collapse space-y-2', // More space between rows
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-10 sm:w-12 font-medium text-base', // Larger headers
        row: 'flex w-full mt-4', // Increased top margin between rows
        cell: 'size-10 sm:size-12 text-center text-base p-1 relative', // Bigger cells
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-10 sm:size-12 p-0 font-medium aria-selected:opacity-100', // Larger days
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-secondary text-secondary-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-60 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-40',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        button: 'duration-300',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />, // Slightly larger icons
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
