import { z } from "@hono/zod-openapi";

export const AuthRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
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
