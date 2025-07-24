import z from "zod";

export const RunCodeSchema = z.object({
    code: z.string().min(1, "Code cannot be empty"),
    input: z.string().optional(),
})

export type RunCodeSchemaType = z.infer<typeof RunCodeSchema>;