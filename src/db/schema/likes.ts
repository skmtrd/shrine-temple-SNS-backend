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
import { users } from "./users";

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("likes_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("likes_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("likes_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("likes_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));
