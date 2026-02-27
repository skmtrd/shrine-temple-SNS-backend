import { relations, sql } from "drizzle-orm";
import { integer, pgPolicy, pgTable, serial } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { pilgrimageRoutes } from "./pilgrimage-routes";
import { temples } from "./temples";

export const routeTemples = pgTable(
  "route_temples",
  {
    id: serial("id").primaryKey(),
    routeId: integer("route_id")
      .notNull()
      .references(() => pilgrimageRoutes.id),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
  },
  () => [
    pgPolicy("route_temples_select_public", {
      for: "select",
      to: "public",
      using: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND is_public = true)`,
    }),
    pgPolicy("route_temples_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))`,
    }),
    pgPolicy("route_temples_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))`,
    }),
    pgPolicy("route_temples_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))`,
      withCheck: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))`,
    }),
    pgPolicy("route_temples_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM pilgrimage_routes WHERE id = route_id AND creator_id = (select auth.uid()))`,
    }),
    pgPolicy("route_temples_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

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
