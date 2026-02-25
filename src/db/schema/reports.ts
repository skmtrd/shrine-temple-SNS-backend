import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const reports = pgTable("reports", {
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
});

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
}));
