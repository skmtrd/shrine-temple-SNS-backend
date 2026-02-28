import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
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

export const officialRequestStatusEnum = pgEnum("official_request_status", [
  "pending",
  "rejected",
  "approved",
]);

export const templeOfficials = pgTable(
  "temple_officials",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
    status: officialRequestStatusEnum("status").notNull().default("pending"),
    applicantName: text("applicant_name").notNull(),
    email: text("email").notNull(),
    contactInfo: text("contact_info").notNull(),
    registryImageUrl: text("registry_image_url").notNull(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  () => [
    pgPolicy("temple_officials_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("temple_officials_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = (select auth.uid())`,
    }),
    pgPolicy("temple_officials_update_pending", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = (select auth.uid()) AND status = 'pending'`,
      withCheck: sql`user_id = (select auth.uid()) AND status = 'pending'`,
    }),
    pgPolicy("temple_officials_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const templeOfficialsRelations = relations(
  templeOfficials,
  ({ one }) => ({
    user: one(users, {
      fields: [templeOfficials.userId],
      references: [users.id],
    }),
    temple: one(temples, {
      fields: [templeOfficials.templeId],
      references: [temples.id],
    }),
  }),
);
