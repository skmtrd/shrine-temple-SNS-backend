import { z } from "@hono/zod-openapi";

export const LoginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .openapi("LoginRequest");

export const AuthRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    displayId: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, "半角英数字とアンダースコアのみ使用できます"),
    username: z.string().min(1).max(50),
  })
  .openapi("AuthRequest");

export const UserSchema = z
  .object({
    id: z.string(),
    email: z.string().nullable(),
  })
  .openapi("User");

export const SessionSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number().nullable(),
  })
  .openapi("Session");

export const AuthResponseSchema = z
  .object({
    message: z.string(),
    user: UserSchema.nullable(),
    session: SessionSchema.nullable(),
  })
  .openapi("AuthResponse");
