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

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    reason: text("reason").notNull(),
    status: text("status").notNull().default("未対応"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("reports_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`reporter_id = (select auth.uid())`,
    }),
    pgPolicy("reports_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`reporter_id = (select auth.uid())`,
    }),
    pgPolicy("reports_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
}));
