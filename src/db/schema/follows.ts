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

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
}));
