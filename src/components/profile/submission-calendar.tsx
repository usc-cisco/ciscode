"use client";

import React, { useMemo } from "react";
import { SubmissionCalendarEntryType } from "@/dtos/user-statistics.dto";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SubmissionCalendarProps {
  submissionCalendar: SubmissionCalendarEntryType[];
  totalSubmissions: number;
  activeDays: number;
  maxStreak: number;
}

interface DayCell {
  date: string;
  count: number;
  month: string;
}

const SubmissionCalendar = ({
  submissionCalendar,
  totalSubmissions,
  activeDays,
  maxStreak,
}: SubmissionCalendarProps) => {
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to midnight

    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 364);

    const countMap = new Map<string, number>();
    submissionCalendar.forEach((entry) => {
      countMap.set(entry.date, entry.count);
    });

    const startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const endDate = new Date(today);
    const endDayOfWeek = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - endDayOfWeek));

    // console.log("Calendar Date Range:", {
    //   today: today.toISOString().split("T")[0],
    //   oneYearAgo: oneYearAgo.toISOString().split("T")[0],
    //   startDate: startDate.toISOString().split("T")[0],
    //   endDate: endDate.toISOString().split("T")[0],
    // });

    const allDays: DayCell[] = [];
    const currentDate = new Date(startDate);
    const monthsSet: { month: string; index: number }[] = [];

    let dayIndex = 0;
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const month = currentDate.toLocaleDateString("en-US", { month: "short" });

      if (currentDate.getDate() === 1 || dayIndex === 0) {
        monthsSet.push({
          month,
          index: Math.floor(dayIndex / 7),
        });
      }

      allDays.push({
        date: dateStr,
        count: countMap.get(dateStr) || 0,
        month,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
    }

    const weeksArray: DayCell[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeksArray.push(allDays.slice(i, i + 7));
    }

    const uniqueMonths = monthsSet.filter(
      (m, i, arr) => i === 0 || m.month !== arr[i - 1].month,
    );

    return { weeks: weeksArray, months: uniqueMonths };
  }, [submissionCalendar]);

  const getIntensityData = (date: string, count: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);

    return {
      count,
      isFuture: cellDate > today,
    };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          <span className="font-semibold text-foreground">
            {totalSubmissions}
          </span>{" "}
          submissions in the last year
        </span>
        <span className="hidden md:inline">
          Total active days:{" "}
          <span className="font-semibold text-foreground">{activeDays}</span>
        </span>
        <span className="hidden md:inline">
          Max streak:{" "}
          <span className="font-semibold text-foreground">{maxStreak}</span>
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          <div className="flex gap-1 mb-2 ml-8">
            {months.map((m, i) => (
              <div
                key={i}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{
                  marginLeft:
                    i === 0
                      ? 0
                      : `${(m.index - months[i - 1]?.index - 1) * 20}px`,
                  minWidth: "20px",
                }}
              >
                {m.month}
              </div>
            ))}
          </div>

          <TooltipProvider delayDuration={100}>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 justify-around mr-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4">
                  Mon
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4">
                  Wed
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4">
                  Fri
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 h-4"></div>
              </div>

              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const { count, isFuture } = getIntensityData(
                      day.date,
                      day.count,
                    );
                    return (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-4 h-4 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer",
                              isFuture &&
                                "bg-gray-200 dark:bg-gray-900 opacity-40",
                              !isFuture &&
                                count === 0 &&
                                "bg-gray-200 dark:bg-gray-800",
                              !isFuture &&
                                count > 0 &&
                                count <= 2 &&
                                "bg-blue-300 dark:bg-blue-900",
                              !isFuture &&
                                count > 2 &&
                                count <= 5 &&
                                "bg-blue-400 dark:bg-blue-700",
                              !isFuture &&
                                count > 5 &&
                                count <= 10 &&
                                "bg-blue-500 dark:bg-blue-600",
                              !isFuture &&
                                count > 10 &&
                                "bg-blue-600 dark:bg-blue-500",
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-semibold">
                              {formatDate(day.date)}
                            </p>
                            <p className="text-xs opacity-90">
                              {day.count} submission{day.count !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800" />
          <div className="w-4 h-4 bg-blue-300 dark:bg-blue-900" />
          <div className="w-4 h-4 bg-blue-400 dark:bg-blue-700" />
          <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600" />
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default SubmissionCalendar;
