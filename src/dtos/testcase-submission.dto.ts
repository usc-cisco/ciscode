import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const TestCaseSubmissionResponse = z.object({
    id: z.number().int().positive(),
    testCaseId: z.number().int().positive(),
    submissionId: z.number().int().positive(),
    output: z.string().nullable(),
    error: z.string().nullable(),
    status: z.enum(TestCaseSubmissionStatusEnum).default(TestCaseSubmissionStatusEnum.PENDING),
});

export type TestCaseSubmissionResponseType = z.infer<typeof TestCaseSubmissionResponse>;