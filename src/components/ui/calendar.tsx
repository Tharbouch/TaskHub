import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const moroccoHolidays2025 = [
  new Date(2025, 0, 1), // January 1
  new Date(2025, 0, 11), // January 11
  new Date(2025, 0, 14), // January 14
  new Date(2025, 2, 31), // March 31
  new Date(2025, 3, 1), // April 1
  new Date(2025, 4, 1), // May 1
  new Date(2025, 5, 6), // June 6
  new Date(2025, 5, 7), // June 7
  new Date(2025, 5, 25), // June 25
  new Date(2025, 6, 30), // July 30
  new Date(2025, 7, 14), // August 14
  new Date(2025, 7, 20), // August 20
  new Date(2025, 7, 21), // August 21
  new Date(2025, 8, 4), // September 18
  new Date(2025, 9, 6), // November 6
  new Date(2025, 10, 18), // November 18
];

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 w-full max-w-sm sm:max-w-md", className)}
      // Define modifiers for  Morocco holidays
      modifiers={{
        moroccoHoliday: moroccoHolidays2025,
      }}
      // Apply literal color styling for Morocco holidays
      modifiersClassNames={{
        moroccoHoliday: "holiday-date",
      }}
      // Customize overall DayPicker class names
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center px-10",
        caption_label: "text-sm font-medium",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 mb-1",
        head_cell: "text-muted-foreground text-center text-sm py-2 font-normal",
        row: "grid grid-cols-7",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-100 dark:[&:has([aria-selected])]:bg-blue-900/30",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 mx-auto"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        day_today:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium ring-1 ring-blue-400 dark:ring-blue-500",
        day_outside: "text-gray-400 dark:text-gray-500 opacity-50",
        day_disabled:
          "text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed",
        day_range_start: "day-range-start rounded-l-md",
        day_range_end: "day-range-end rounded-r-md",
        day_range_middle: "day-range-middle",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft
            className={cn("h-4 w-4", className)}
            {...props}
            aria-label="Previous month"
          />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight
            className={cn("h-4 w-4", className)}
            {...props}
            aria-label="Next month"
          />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
