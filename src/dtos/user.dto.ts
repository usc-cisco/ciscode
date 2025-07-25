import RoleEnum from "@/lib/types/enums/role.enum";
import z from "zod";

export const LoginRequestSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
});

export const RegisterRequestSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
    name: z.string().min(2).max(50),
    role: z.enum(RoleEnum).optional().default(RoleEnum.USER),
});

export const UserResponseSchema = z.object({
    id: z.number(),
    username: z.string().min(3).max(30),
    name: z.string().min(2).max(50).optional(),
    role: z.enum(RoleEnum)
});

export const UserResponseSchemaWithPassword = UserResponseSchema.extend({
    password: z.string().min(6).max(100),
});

export type LoginRequestSchemaType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestSchemaType = z.infer<typeof RegisterRequestSchema>;
export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>;