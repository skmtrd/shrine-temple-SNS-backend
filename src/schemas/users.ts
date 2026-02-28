import { z } from "@hono/zod-openapi";

export const MeResponseSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    displayId: z.string(),
    username: z.string(),
    role: z.string(),
    profileImage: z.string().nullable(),
    bio: z.string().nullable(),
    createdAt: z.string(),
  })
  .openapi("MeResponse");
