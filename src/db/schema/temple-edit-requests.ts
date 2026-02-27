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
import { temples } from "./temples";
import { users } from "./users";

export const templeEditRequests = pgTable(
  "temple_edit_requests",
  {
    id: serial("id").primaryKey(),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id),
    fieldName: text("field_name").notNull(),
    newValue: text("new_value"),
    status: text("status").notNull().default("未対応"),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("temple_edit_requests_select_requester", {
      for: "select",
      to: authenticatedRole,
      using: sql`requester_id = (select auth.uid())`,
    }),
    pgPolicy("temple_edit_requests_select_official", {
      for: "select",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_edit_requests_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`requester_id = (select auth.uid())`,
    }),
    pgPolicy("temple_edit_requests_update_official", {
      for: "update",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_edit_requests_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`requester_id = (select auth.uid())`,
    }),
    pgPolicy("temple_edit_requests_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const templeEditRequestsRelations = relations(
  templeEditRequests,
  ({ one }) => ({
    temple: one(temples, {
      fields: [templeEditRequests.templeId],
      references: [temples.id],
    }),
    requester: one(users, {
      fields: [templeEditRequests.requesterId],
      references: [users.id],
    }),
  }),
);
