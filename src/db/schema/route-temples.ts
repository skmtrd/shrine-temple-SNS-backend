import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { pilgrimageRoutes } from "./pilgrimage-routes";
import { temples } from "./temples";

export const routeTemples = pgTable("route_temples", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id")
    .notNull()
    .references(() => pilgrimageRoutes.id),
  templeId: integer("temple_id")
    .notNull()
    .references(() => temples.id),
});

export const routeTemplesRelations = relations(routeTemples, ({ one }) => ({
  route: one(pilgrimageRoutes, {
    fields: [routeTemples.routeId],
    references: [pilgrimageRoutes.id],
  }),
  temple: one(temples, {
    fields: [routeTemples.templeId],
    references: [temples.id],
  }),
}));
