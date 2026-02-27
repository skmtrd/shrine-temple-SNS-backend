import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { pilgrimageRoutes } from "./pilgrimage-routes";
import { users } from "./users";

export const pilgrimageImpressions = pgTable(
  "pilgrimage_impressions",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    routeId: integer("route_id")
      .notNull()
      .references(() => pilgrimageRoutes.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("pilgrimage_impressions_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("pilgrimage_impressions_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_impressions_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_impressions_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_impressions_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const pilgrimageImpressionsRelations = relations(
  pilgrimageImpressions,
  ({ one }) => ({
    user: one(users, {
      fields: [pilgrimageImpressions.userId],
      references: [users.id],
    }),
    route: one(pilgrimageRoutes, {
      fields: [pilgrimageImpressions.routeId],
      references: [pilgrimageRoutes.id],
    }),
  }),
);
