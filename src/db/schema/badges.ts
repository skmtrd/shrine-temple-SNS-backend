import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userBadges } from "./user-badges";

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  conditionType: text("condition_type").notNull(),
  conditionValue: integer("condition_value").notNull(),
});

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));
