import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { temples } from "./temples";
import { users } from "./users";
import { visitPhotos } from "./visit-photos";

export const visitHistories = pgTable("visit_histories", {
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
});

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
