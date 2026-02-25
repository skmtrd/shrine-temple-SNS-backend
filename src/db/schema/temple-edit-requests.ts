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

export const templeEditRequests = pgTable("temple_edit_requests", {
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
});

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
