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

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    parentCommentId: integer("parent_comment_id"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("comments_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("comments_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("comments_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("comments_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("comments_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
}));
