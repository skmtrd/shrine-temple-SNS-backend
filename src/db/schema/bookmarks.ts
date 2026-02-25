import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { temples } from "./temples";
import { users } from "./users";

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  templeId: integer("temple_id")
    .notNull()
    .references(() => temples.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  temple: one(temples, {
    fields: [bookmarks.templeId],
    references: [temples.id],
  }),
}));
