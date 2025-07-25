import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import z from "zod";

export const ProblemSchemaResponse = z.object({
    id: z.int(),
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().max(1000).optional(),
    authorId: z.number(),
    author: z.string().min(2).max(50).optional(),
});

export const AddProblemSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    difficulty: z.enum(DifficultyEnum),
    defaultCode: z.string().max(1000).optional(),
})

export type AddProblemSchemaType = z.infer<typeof AddProblemSchema>;
export type ProblemSchemaResponseType = z.infer<typeof ProblemSchemaResponse>;