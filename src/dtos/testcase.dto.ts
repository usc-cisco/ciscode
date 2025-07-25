import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const TestCaseResponse = z.object({
    id: z.number(),
    problemId: z.number(),
    input: z.string().min(1, "Input cannot be empty"),
    expectedOutput: z.string().min(1, "Output cannot be empty"),
    actualOutput: z.string().optional(),
    status: z.enum(SubmissionStatusEnum)
})

export type TestCaseResponseType = z.infer<typeof TestCaseResponse>;