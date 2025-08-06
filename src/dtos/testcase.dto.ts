import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const TestCaseResponse = z.object({
    id: z.number(),
    problemId: z.number(),
    input: z.string().min(1, "Input cannot be empty"),
    output: z.string().min(1, "Output cannot be empty"),
    hidden: z.boolean().default(false),
})

export const AddTestCaseSchema = z.object({
    input: z.string().min(1, "Input cannot be empty"),
    output: z.string().optional(),
    hidden: z.boolean().default(false),
    problemId: z.number().int().positive("Problem ID must be a positive integer").optional(),
    status: z.enum(SubmissionStatusEnum).optional().default(SubmissionStatusEnum.PENDING),
});

export type TestCaseResponseType = z.infer<typeof TestCaseResponse>;
export type AddTestCaseSchemaType = z.infer<typeof AddTestCaseSchema>;