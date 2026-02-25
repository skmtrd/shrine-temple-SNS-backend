import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { pilgrimageRoutes } from "./pilgrimage-routes";
import { users } from "./users";

export const pilgrimageImpressions = pgTable("pilgrimage_impressions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  routeId: integer("route_id")
    .notNull()
    .references(() => pilgrimageRoutes.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pilgrimageImpressionsRelations = relations(
  pilgrimageImpressions,
  ({ one }) => ({
    user: one(users, {
      fields: [pilgrimageImpressions.userId],
      references: [users.id],
    }),
    route: one(pilgrimageRoutes, {
      fields: [pilgrimageImpressions.routeId],
      references: [pilgrimageRoutes.id],
    }),
  }),
);
