import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { temples } from "./temples";
import { users } from "./users";

export const templeOfficials = pgTable("temple_officials", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  templeId: integer("temple_id")
    .notNull()
    .references(() => temples.id),
  status: text("status").notNull().default("申請中"),
  applicantName: text("applicant_name").notNull(),
  contactInfo: text("contact_info").notNull(),
  registryImageUrl: text("registry_image_url").notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

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
