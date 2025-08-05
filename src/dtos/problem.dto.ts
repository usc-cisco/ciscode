import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import ProblemStatusEnum from "@/lib/types/enums/problemstatus.enum";
import z from "zod";

export const ProblemSchemaDisplayResponse = z.object({
    id: z.int(),
    title: z.string().min(2).max(100),
    author: z.string().min(2).max(50).optional(),
    difficulty: z.enum(DifficultyEnum),
    acceptance: z.number().min(0).max(100).optional(),
    status: z.enum(ProblemStatusEnum).optional(),
});

export const ProblemSchemaResponse = z.object({
    id: z.int(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().optional().nullable().default(null),
    authorId: z.number(),
    author: z.string().min(2).max(50).optional(),
});

export const AddProblemSchema = z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().optional().nullable().default(null),
    solutionCode: z.string().optional().default(""),
})

export type AddProblemSchemaType = z.infer<typeof AddProblemSchema>;
export type ProblemSchemaResponseType = z.infer<typeof ProblemSchemaResponse>;
export type ProblemSchemaDisplayResponseType = z.infer<typeof ProblemSchemaDisplayResponse>;