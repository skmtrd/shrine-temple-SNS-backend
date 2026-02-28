import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { createAuthenticatedClient } from "../lib/supabase";
import { ErrorSchema } from "../schemas/common";
import { MeResponseSchema } from "../schemas/users";
import type { Variables } from "../types";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getMeRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Users"],
  summary: "自分のユーザー情報取得",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: MeResponseSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ユーザーが見つかりません",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(getMeRoute, async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Missing authorization header" }, 401);
  }

  const supabase = createAuthenticatedClient(authHeader);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: "認証に失敗しました" }, 401);
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }

  const me = result[0];
  return c.json(
    {
      id: me.id,
      email: me.email,
      displayId: me.displayId,
      username: me.username,
      role: me.role,
      profileImage: me.profileImage ?? null,
      bio: me.bio ?? null,
      createdAt: me.createdAt.toISOString(),
    },
    200,
  );
});

export { app as userRoutes };
