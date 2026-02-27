import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgTable,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { badges } from "./badges";
import { users } from "./users";

export const userBadges = pgTable(
  "user_badges",
  {
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
  },
  () => [
    pgPolicy("user_badges_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("user_badges_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

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
