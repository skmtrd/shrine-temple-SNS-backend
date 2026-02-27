import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../db";
import { users } from "../db/schema";
import { createAnonClient, createAuthenticatedClient } from "../lib/supabase";
import {
  AuthRequestSchema,
  AuthResponseSchema,
  LoginRequestSchema,
} from "../schemas/auth";
import { ErrorSchema } from "../schemas/common";
import type { Variables } from "../types";

const MessageSchema = z
  .object({
    message: z.string(),
  })
  .openapi("MessageResponse");

const app = new OpenAPIHono<{ Variables: Variables }>();

const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["Auth"],
  summary: "アカウント作成",
  request: {
    body: { content: { "application/json": { schema: AuthRequestSchema } } },
  },
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    400: {
      description: "エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(signupRoute, async (c) => {
  const { email, password, displayId, username } = c.req.valid("json");
  const supabase = createAnonClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  if (!data.user) {
    return c.json({ error: "ユーザー作成に失敗しました" }, 400);
  }

  try {
    await db.insert(users).values({
      id: data.user.id,
      email,
      displayId,
      username,
    });
  } catch (dbError: unknown) {
    const message =
      dbError instanceof Error
        ? dbError.message
        : "ユーザー情報の登録に失敗しました";
    return c.json({ error: message }, 400);
  }

  return c.json(
    {
      message: "Account created successfully",
      user: { id: data.user.id, email: data.user.email ?? null },
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at ?? null,
          }
        : null,
    },
    200,
  );
});

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "ログイン",
  request: {
    body: { content: { "application/json": { schema: LoginRequestSchema } } },
  },
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("json");
  const supabase = createAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  return c.json(
    {
      message: "Login successful",
      user: { id: data.user.id, email: data.user.email ?? null },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at ?? null,
      },
    },
    200,
  );
});

const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  tags: ["Auth"],
  summary: "ログアウト",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "成功",
      content: { "application/json": { schema: MessageSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(logoutRoute, async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Missing authorization header" }, 401);
  }

  const supabase = createAuthenticatedClient(authHeader);
  const { error } = await supabase.auth.signOut();

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  return c.json({ message: "Logged out successfully" }, 200);
});

export { app as authRoutes };
