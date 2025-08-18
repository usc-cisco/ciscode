import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import z from "zod";
import { TestCaseSubmissionResponse } from "./testcase-submission.dto";
import { UserResponseSchema } from "./user.dto";

export const SubmissionResponse = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  problemId: z.number().int().positive(),
  code: z.string().optional().default(""),
  status: z.enum(SubmissionStatusEnum).default(SubmissionStatusEnum.ATTEMPTED),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

export const SubmissionResponseWithTestCaseSubmission =
  SubmissionResponse.extend({
    testCaseSubmissions: z
      .array(TestCaseSubmissionResponse)
      .optional()
      .default([]),
  });

export const SubmissionResponseWithTestCaseSubmissionAndUser =
  SubmissionResponseWithTestCaseSubmission.extend({
    user: UserResponseSchema,
  });

export const SubmissionActivitySchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  problemId: z.number().int().positive(),
  title: z.string(),
  status: z.enum(SubmissionStatusEnum).default(SubmissionStatusEnum.ATTEMPTED),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

export const UpdateSubmissionSchema = z.object({
  code: z.string().optional().default(""),
  status: z
    .enum(SubmissionStatusEnum)
    .optional()
    .default(SubmissionStatusEnum.ATTEMPTED),
});

export type SubmissionResponseType = z.infer<typeof SubmissionResponse>;
export type SubmissionResponseWithTestCaseSubmissionType = z.infer<
  typeof SubmissionResponseWithTestCaseSubmission
>;
export type SubmissionResponseWithTestCaseSubmissionAndUserType = z.infer<
  typeof SubmissionResponseWithTestCaseSubmissionAndUser
>;
export type SubmissionActivityType = z.infer<typeof SubmissionActivitySchema>;
export type UpdateSubmissionType = z.infer<typeof UpdateSubmissionSchema>;
