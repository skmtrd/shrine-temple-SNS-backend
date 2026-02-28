import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../db";
import { temples } from "../db/schema";
import { ErrorSchema } from "../schemas/common";
import { TempleListResponseSchema } from "../schemas/temples";
import type { Variables } from "../types/index";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getTemplesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Temples"],
  summary: "寺社一覧取得",
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: TempleListResponseSchema } },
    },
    500: {
      description: "サーバーエラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(getTemplesRoute, async (c) => {
  const result = await db
    .select({ id: temples.id, name: temples.name, address: temples.address })
    .from(temples);

  return c.json({ temples: result }, 200);
});

export { app as templeRoutes };
