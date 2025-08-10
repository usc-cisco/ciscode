import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const TestCaseResponse = z.object({
    id: z.number(),
    problemId: z.number(),
    input: z.string().optional(),
    output: z.string().optional(),
    actualOutput: z.string().optional().nullable(),
    hidden: z.boolean().default(false),
    status: z.enum(TestCaseSubmissionStatusEnum).optional().default(TestCaseSubmissionStatusEnum.PENDING),
})

export const AddTestCaseSchema = z.object({
    id: z.number().int().positive("ID must be a positive integer").optional(),
    input: z.string().optional(),
    output: z.string().optional(),
    hidden: z.boolean().default(false),
    problemId: z.number().int().positive("Problem ID must be a positive integer").optional(),
    status: z.enum(TestCaseSubmissionStatusEnum).optional().default(TestCaseSubmissionStatusEnum.PENDING),
});

export type TestCaseResponseType = z.infer<typeof TestCaseResponse>;
export type AddTestCaseSchemaType = z.infer<typeof AddTestCaseSchema>;