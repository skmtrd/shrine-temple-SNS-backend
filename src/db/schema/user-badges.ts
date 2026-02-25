import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { badges } from "./badges";
import { users } from "./users";

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  badgeId: integer("badge_id")
    .notNull()
    .references(() => badges.id),
  awardedAt: timestamp("awarded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));
