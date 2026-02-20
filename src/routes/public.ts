import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { HelloResponseSchema } from "../schemas/public";
import type { Variables } from "../types";

const app = new OpenAPIHono<{ Variables: Variables }>();

const helloRoute = createRoute({
  method: "get",
  path: "/hello",
  tags: ["Public"],
  summary: "Hello エンドポイント",
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: HelloResponseSchema } },
    },
  },
});

app.openapi(helloRoute, (c) => {
  return c.json(
    {
      message: "Hello from Shrine Temple SNS API!",
      timestamp: new Date().toISOString(),
    },
    200,
  );
});

export { app as publicRoutes };
