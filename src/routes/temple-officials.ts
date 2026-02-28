import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { templeOfficials, temples, users } from "../db/schema";
import { createAuthenticatedClient } from "../lib/supabase";
import { ErrorSchema } from "../schemas/common";
import {
  CreateOfficialRequestSchema,
  OfficialRequestListResponseSchema,
  OfficialRequestSchema,
  UpdateOfficialRequestStatusSchema,
} from "../schemas/temple-officials";
import type { Variables } from "../types/index";

const app = new OpenAPIHono<{ Variables: Variables }>();

// ========== POST /api/temple-officials ==========
const createOfficialRequestRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["TempleOfficials"],
  summary: "公式アカウント申請",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreateOfficialRequestSchema } },
    },
  },
  responses: {
    201: {
      description: "申請成功",
      content: { "application/json": { schema: OfficialRequestSchema } },
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

app.openapi(createOfficialRequestRoute, async (c) => {
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

  const body = c.req.valid("json");

  const inserted = await db
    .insert(templeOfficials)
    .values({
      userId: user.id,
      templeId: body.templeId,
      applicantName: body.applicantName,
      email: user.email ?? "",
      contactInfo: body.contactInfo,
      registryImageUrl: body.registryImageUrl,
      status: "pending",
    })
    .returning();

  const created = inserted[0];

  const templeResult = await db
    .select({ name: temples.name })
    .from(temples)
    .where(eq(temples.id, created.templeId))
    .limit(1);

  const userResult = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, created.userId))
    .limit(1);

  return c.json(
    {
      id: created.id,
      userId: created.userId,
      templeId: created.templeId,
      status: created.status,
      applicantName: created.applicantName,
      email: created.email,
      contactInfo: created.contactInfo,
      registryImageUrl: created.registryImageUrl,
      approvedAt: created.approvedAt?.toISOString() ?? null,
      userName: userResult[0]?.username ?? null,
      templeName: templeResult[0]?.name ?? null,
    },
    201,
  );
});

// ========== GET /api/temple-officials ==========
const getOfficialRequestsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["TempleOfficials"],
  summary: "全申請一覧取得（管理者のみ）",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "成功",
      content: {
        "application/json": { schema: OfficialRequestListResponseSchema },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "権限エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(getOfficialRequestsRoute, async (c) => {
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

  const me = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (me[0]?.role !== "admin") {
    return c.json({ error: "管理者権限が必要です" }, 403);
  }

  const rows = await db
    .select({
      id: templeOfficials.id,
      userId: templeOfficials.userId,
      templeId: templeOfficials.templeId,
      status: templeOfficials.status,
      applicantName: templeOfficials.applicantName,
      email: templeOfficials.email,
      contactInfo: templeOfficials.contactInfo,
      registryImageUrl: templeOfficials.registryImageUrl,
      approvedAt: templeOfficials.approvedAt,
      userName: users.username,
      templeName: temples.name,
    })
    .from(templeOfficials)
    .leftJoin(users, eq(templeOfficials.userId, users.id))
    .leftJoin(temples, eq(templeOfficials.templeId, temples.id));

  return c.json(
    {
      requests: rows.map((r) => ({
        ...r,
        approvedAt: r.approvedAt?.toISOString() ?? null,
      })),
    },
    200,
  );
});

// ========== GET /api/temple-officials/mine ==========
const getMyOfficialRequestsRoute = createRoute({
  method: "get",
  path: "/mine",
  tags: ["TempleOfficials"],
  summary: "自分の申請一覧取得",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "成功",
      content: {
        "application/json": { schema: OfficialRequestListResponseSchema },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(getMyOfficialRequestsRoute, async (c) => {
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

  const rows = await db
    .select({
      id: templeOfficials.id,
      userId: templeOfficials.userId,
      templeId: templeOfficials.templeId,
      status: templeOfficials.status,
      applicantName: templeOfficials.applicantName,
      email: templeOfficials.email,
      contactInfo: templeOfficials.contactInfo,
      registryImageUrl: templeOfficials.registryImageUrl,
      approvedAt: templeOfficials.approvedAt,
      userName: users.username,
      templeName: temples.name,
    })
    .from(templeOfficials)
    .leftJoin(users, eq(templeOfficials.userId, users.id))
    .leftJoin(temples, eq(templeOfficials.templeId, temples.id))
    .where(eq(templeOfficials.userId, user.id));

  return c.json(
    {
      requests: rows.map((r) => ({
        ...r,
        approvedAt: r.approvedAt?.toISOString() ?? null,
      })),
    },
    200,
  );
});

// ========== PATCH /api/temple-officials/:id ==========
const updateOfficialRequestStatusRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["TempleOfficials"],
  summary: "申請ステータス更新（管理者のみ）",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": { schema: UpdateOfficialRequestStatusSchema },
      },
    },
  },
  responses: {
    200: {
      description: "更新成功",
      content: { "application/json": { schema: OfficialRequestSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "権限エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "申請が見つかりません",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

app.openapi(updateOfficialRequestStatusRoute, async (c) => {
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

  const me = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (me[0]?.role !== "admin") {
    return c.json({ error: "管理者権限が必要です" }, 403);
  }

  const { id } = c.req.valid("param");
  const { status } = c.req.valid("json");
  const requestId = Number.parseInt(id, 10);

  const existing = await db
    .select()
    .from(templeOfficials)
    .where(eq(templeOfficials.id, requestId))
    .limit(1);

  if (existing.length === 0) {
    return c.json({ error: "申請が見つかりません" }, 404);
  }

  const now = new Date();
  const updateData =
    status === "approved"
      ? { status: "approved" as const, approvedAt: now }
      : { status: "rejected" as const };

  const updated = await db
    .update(templeOfficials)
    .set(updateData)
    .where(eq(templeOfficials.id, requestId))
    .returning();

  if (status === "approved") {
    await db
      .update(users)
      .set({ role: "official" })
      .where(eq(users.id, existing[0].userId));
  }

  const r = updated[0];

  const templeResult = await db
    .select({ name: temples.name })
    .from(temples)
    .where(eq(temples.id, r.templeId))
    .limit(1);

  const userResult = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, r.userId))
    .limit(1);

  return c.json(
    {
      id: r.id,
      userId: r.userId,
      templeId: r.templeId,
      status: r.status,
      applicantName: r.applicantName,
      email: r.email,
      contactInfo: r.contactInfo,
      registryImageUrl: r.registryImageUrl,
      approvedAt: r.approvedAt?.toISOString() ?? null,
      userName: userResult[0]?.username ?? null,
      templeName: templeResult[0]?.name ?? null,
    },
    200,
  );
});

export { app as templeOfficialsRoutes };
