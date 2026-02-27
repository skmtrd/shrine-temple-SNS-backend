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

export const userPilgrimages = pgTable(
  "user_pilgrimages",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    routeId: integer("route_id")
      .notNull()
      .references(() => pilgrimageRoutes.id),
    status: text("status").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  () => [
    pgPolicy("user_pilgrimages_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("user_pilgrimages_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("user_pilgrimages_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("user_pilgrimages_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("user_pilgrimages_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const userPilgrimagesRelations = relations(
  userPilgrimages,
  ({ one }) => ({
    user: one(users, {
      fields: [userPilgrimages.userId],
      references: [users.id],
    }),
    route: one(pilgrimageRoutes, {
      fields: [userPilgrimages.routeId],
      references: [pilgrimageRoutes.id],
    }),
  }),
);
