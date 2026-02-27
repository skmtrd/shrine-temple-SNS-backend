import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { temples } from "./temples";
import { users } from "./users";
import { visitPhotos } from "./visit-photos";

export const visitHistories = pgTable(
  "visit_histories",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
    content: text("content"),
    visitDate: timestamp("visit_date", { withTimezone: true }).notNull(),
    isGoshuin: boolean("is_goshuin").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("visit_histories_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("visit_histories_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("visit_histories_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("visit_histories_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("visit_histories_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const visitHistoriesRelations = relations(
  visitHistories,
  ({ one, many }) => ({
    user: one(users, {
      fields: [visitHistories.userId],
      references: [users.id],
    }),
    temple: one(temples, {
      fields: [visitHistories.templeId],
      references: [temples.id],
    }),
    photos: many(visitPhotos),
  }),
);
