import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const SubmissionResponse = z.object({
    testCaseId: z.number(),
    userId: z.number(),
    output: z.string().optional(),
    status: z.enum(SubmissionStatusEnum),
})

export const AddSubmissionSchema = z.object({
    testCaseId: z.number().min(1, "Test case ID must be positive"),
    code: z.string().min(1, "Code cannot be empty"),
})

export type SubmissionResponseType = z.infer<typeof SubmissionResponse>;
export type AddSubmissionSchemaType = z.infer<typeof AddSubmissionSchema>;