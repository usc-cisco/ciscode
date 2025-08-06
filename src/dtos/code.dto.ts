import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import z from "zod";

export const RunCodeSchema = z.object({
    code: z.string().min(1, "Code cannot be empty"),
    input: z.string().optional(),
})

export const RunCodeResponseSchema = z.object({
    output: z.string().nullable(),
    error: z.string().nullable(),
});

export const CheckCodeResponseSchema = RunCodeResponseSchema.extend({
    status: z.enum(SubmissionStatusEnum).default(SubmissionStatusEnum.PENDING),
});

export type RunCodeSchemaType = z.infer<typeof RunCodeSchema>;
export type RunCodeResponseType = z.infer<typeof RunCodeResponseSchema>;
export type CheckCodeResponseType = z.infer<typeof CheckCodeResponseSchema>;