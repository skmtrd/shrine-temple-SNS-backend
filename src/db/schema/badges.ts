import { relations, sql } from "drizzle-orm";
import { integer, pgPolicy, pgTable, serial, text } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { userBadges } from "./user-badges";

export const badges = pgTable(
  "badges",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    conditionType: text("condition_type").notNull(),
    conditionValue: integer("condition_value").notNull(),
  },
  () => [
    pgPolicy("badges_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("badges_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));
