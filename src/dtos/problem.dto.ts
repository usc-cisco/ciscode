import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import z from "zod";
import { AddTestCaseSchema, TestCaseResponse } from "./testcase.dto";

export const ProblemSchemaDisplayResponse = z.object({
    id: z.int(),
    title: z.string(),
    author: z.string().optional(),
    difficulty: z.enum(DifficultyEnum),
    acceptance: z.number().min(0).max(100).optional(),
    status: z.enum(SubmissionStatusEnum).optional(),
    verified: z.boolean().optional(),
});

export const ProblemSchemaResponse = z.object({
    id: z.int(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().optional().nullable().default(null),
    solutionCode: z.string().optional().default("").optional(),
    answerCode: z.string().optional().nullable().default(null),
    authorId: z.number(),
    author: z.string().min(2).max(50).optional(),
    status: z.enum(SubmissionStatusEnum).optional(),
});

export const ProblemSchemaResponseWithTestCases = ProblemSchemaResponse.extend({
    testCases: z.array(TestCaseResponse).optional().default([]),
});

export const AddProblemSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title cannot exceed 100 characters"),
    description: z.string().min(2, "Description must be at least 2 characters").max(500, "Description cannot exceed 500 characters"),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().optional().nullable().default(null),
    solutionCode: z.string().optional().default(""),
    testCases: z.array(AddTestCaseSchema).min(1, "At least one test case is required").max(20, "Cannot have more than 20 test cases").optional(),
})

export type AddProblemSchemaType = z.infer<typeof AddProblemSchema>;
export type ProblemSchemaResponseType = z.infer<typeof ProblemSchemaResponse>;
export type ProblemSchemaDisplayResponseType = z.infer<typeof ProblemSchemaDisplayResponse>;
export type ProblemSchemaResponseWithTestCasesType = z.infer<typeof ProblemSchemaResponseWithTestCases>;