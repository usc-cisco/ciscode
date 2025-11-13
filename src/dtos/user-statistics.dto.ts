import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import z from "zod";

export const DifficultyStatsSchema = z.object({
  [DifficultyEnum.PROG1]: z.number().min(0).default(0),
  [DifficultyEnum.PROG2]: z.number().min(0).default(0),
  [DifficultyEnum.DSA]: z.number().min(0).default(0),
});

export const SubmissionCalendarEntrySchema = z.object({
  date: z.string(), // YYYY-MM-DD format
  count: z.number().min(0),
});

export const UserStatisticsSchema = z.object({
  totalSolved: z.number().min(0).default(0),
  totalProblems: z.number().min(0).default(0),
  solvedByDifficulty: DifficultyStatsSchema,
  totalByDifficulty: DifficultyStatsSchema,
  submissionCalendar: z.array(SubmissionCalendarEntrySchema),
  totalSubmissions: z.number().min(0).default(0),
  activeDays: z.number().min(0).default(0),
  maxStreak: z.number().min(0).default(0),
});

export type DifficultyStatsType = z.infer<typeof DifficultyStatsSchema>;
export type SubmissionCalendarEntryType = z.infer<
  typeof SubmissionCalendarEntrySchema
>;
export type UserStatisticsType = z.infer<typeof UserStatisticsSchema>;
