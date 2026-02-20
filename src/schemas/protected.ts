import { z } from "@hono/zod-openapi";
import { UserSchema } from "./auth";

export const ProtectedMeResponseSchema = z
  .object({
    message: z.string(),
    user: UserSchema.nullable(),
    timestamp: z.string(),
  })
  .openapi("ProtectedMeResponse");
