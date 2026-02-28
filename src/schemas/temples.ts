import { z } from "@hono/zod-openapi";

export const TempleListItemSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    address: z.string().nullable(),
  })
  .openapi("TempleListItem");

export const TempleListResponseSchema = z
  .object({
    temples: z.array(TempleListItemSchema),
  })
  .openapi("TempleListResponse");
