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

export const userPilgrimages = pgTable("user_pilgrimages", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  routeId: integer("route_id")
    .notNull()
    .references(() => pilgrimageRoutes.id),
  status: text("status").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const userPilgrimagesRelations = relations(
  userPilgrimages,
  ({ one }) => ({
    user: one(users, {
      fields: [userPilgrimages.userId],
      references: [users.id],
    }),
    route: one(pilgrimageRoutes, {
      fields: [userPilgrimages.routeId],
      references: [pilgrimageRoutes.id],
    }),
  }),
);
