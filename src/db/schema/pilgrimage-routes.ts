import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgPolicy,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { pilgrimageImpressions } from "./pilgrimage-impressions";
import { routeTemples } from "./route-temples";
import { userPilgrimages } from "./user-pilgrimages";
import { users } from "./users";

export const pilgrimageRoutes = pgTable(
  "pilgrimage_routes",
  {
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
  },
  () => [
    pgPolicy("pilgrimage_routes_select_public", {
      for: "select",
      to: "public",
      using: sql`is_public = true`,
    }),
    pgPolicy("pilgrimage_routes_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`creator_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_routes_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`creator_id = (select auth.uid()) AND type = 'ユーザー'`,
    }),
    pgPolicy("pilgrimage_routes_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`creator_id = (select auth.uid())`,
      withCheck: sql`creator_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_routes_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`creator_id = (select auth.uid())`,
    }),
    pgPolicy("pilgrimage_routes_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

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
