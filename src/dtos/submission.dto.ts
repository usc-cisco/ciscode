import ProblemStatusEnum from "@/lib/types/enums/problemstatus.enum";
import { TestCaseSubmission } from "@/models/testcase-submission.model";
import z from "zod";
import { TestCaseSubmissionResponse } from "./testcase-submission.dto";

export const SubmissionResponse = z.object({
    id: z.number().int().positive(),
    userId: z.number().int().positive(),
    problemId: z.number().int().positive(),
    code: z.string().optional().default(""),
    status: z.enum(ProblemStatusEnum).default(ProblemStatusEnum.ATTEMPTED),
});

export const SubmissionResponseWithTestCaseSubmission = SubmissionResponse.extend({
    testCaseSubmissions: z.array(TestCaseSubmissionResponse).optional().default([]),
});

export const UpdateSubmissionSchema = z.object({
    code: z.string().optional().default(""),
    status: z.enum(ProblemStatusEnum).optional().default(ProblemStatusEnum.ATTEMPTED),
});

export type SubmissionResponseType = z.infer<typeof SubmissionResponse>;
export type SubmissionResponseWithTestCaseSubmissionType = z.infer<typeof SubmissionResponseWithTestCaseSubmission>;
export type UpdateSubmissionType = z.infer<typeof UpdateSubmissionSchema>;