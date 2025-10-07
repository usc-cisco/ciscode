import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import z from "zod";
import { AddTestCaseSchema, TestCaseResponse } from "./testcase.dto";
import { CategoryEnum } from "@/lib/types/enums/category.enum";

export const ProblemSchemaDisplayResponse = z.object({
  id: z.int(),
  title: z.string(),
  author: z.string().optional(),
  difficulty: z.enum(DifficultyEnum),
  acceptance: z.number().min(0).max(100).optional(),
  status: z.enum(SubmissionStatusEnum).optional(),
  verified: z.boolean().optional(),
  success: z.number().min(0).max(100).optional(),
  numOfSubmissions: z.number().min(0).default(0),
});

export const ProblemSchemaResponse = z.object({
  id: z.int(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(DifficultyEnum),
  categories: z.string().optional().default(""),
  defaultCode: z.string().optional().nullable().default(null),
  solutionCode: z.string().optional().default("").optional(),
  answerCode: z.string().optional().nullable().default(null),
  verified: z.boolean().optional(),
  authorId: z.number(),
  author: z.string().optional(),
  status: z.enum(SubmissionStatusEnum).optional(),
});

export const ProblemSchemaResponseWithTestCases = ProblemSchemaResponse.extend({
  testCases: z.array(TestCaseResponse).optional().default([]),
  numOfSubmissions: z.number().min(0).default(0),
});

export const AddProblemSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(DifficultyEnum),
  categories: z.array(z.string()),
  defaultCode: z.string().optional().nullable().default(null),
  solutionCode: z.string().optional().default(""),
  verified: z.boolean().optional(),
  testCases: z
    .array(AddTestCaseSchema)
    .min(1, "At least one test case is required")
    .max(20, "Cannot have more than 20 test cases")
    .optional(),
});

export type AddProblemSchemaType = z.infer<typeof AddProblemSchema>;
export type ProblemSchemaResponseType = z.infer<typeof ProblemSchemaResponse>;
export type ProblemSchemaDisplayResponseType = z.infer<
  typeof ProblemSchemaDisplayResponse
>;
export type ProblemSchemaResponseWithTestCasesType = z.infer<
  typeof ProblemSchemaResponseWithTestCases
>;
