import { z } from '@hono/zod-openapi'

export const HelloResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
}).openapi('HelloResponse')
