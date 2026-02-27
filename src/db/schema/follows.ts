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

export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("follows_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("follows_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`follower_id = (select auth.uid())`,
    }),
    pgPolicy("follows_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`follower_id = (select auth.uid())`,
    }),
    pgPolicy("follows_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
}));
