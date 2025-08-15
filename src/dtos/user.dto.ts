import RoleEnum from "@/lib/types/enums/role.enum";
import z from "zod";

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  name: z.string().optional(),
  role: z.enum(RoleEnum).optional().default(RoleEnum.USER),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  role: z.enum(RoleEnum),
});

export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional(),
  role: z.enum(RoleEnum),
});

export const UserResponseSchemaWithPassword = UserResponseSchema.extend({
  password: z.string(),
});

export const UpdateUserSchema = z.object({
  username: z.string(),
  name: z.string().optional(),
  role: z.enum(RoleEnum).optional(),
});

export type LoginRequestSchemaType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestSchemaType = z.infer<typeof RegisterRequestSchema>;

export type LoginResponseSchemaType = z.infer<typeof LoginResponseSchema>;
export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
