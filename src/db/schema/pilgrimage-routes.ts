import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { pilgrimageImpressions } from "./pilgrimage-impressions";
import { routeTemples } from "./route-temples";
import { userPilgrimages } from "./user-pilgrimages";
import { users } from "./users";

export const pilgrimageRoutes = pgTable("pilgrimage_routes", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  creatorId: uuid("creator_id").references(() => users.id),
  name: text("name").notNull(),
  alias: text("alias"),
  description: text("description"),
  area: text("area"),
  typeTag: text("type_tag"),
  religion: text("religion"),
  blessingTags: text("blessing_tags"),
  isPublic: boolean("is_public").notNull().default(true),
});

export const pilgrimageRoutesRelations = relations(
  pilgrimageRoutes,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [pilgrimageRoutes.creatorId],
      references: [users.id],
    }),
    routeTemples: many(routeTemples),
    userPilgrimages: many(userPilgrimages),
    impressions: many(pilgrimageImpressions),
  }),
);
