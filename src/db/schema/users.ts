import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { bookmarks } from "./bookmarks";
import { comments } from "./comments";
import { follows } from "./follows";
import { likes } from "./likes";
import { reports } from "./reports";
import { templeOfficials } from "./temple-officials";
import { temples } from "./temples";
import { userBadges } from "./user-badges";
import { userPilgrimages } from "./user-pilgrimages";
import { visitHistories } from "./visit-histories";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  role: text("role").notNull().default("一般"),
  email: text("email").notNull().unique(),
  displayId: text("display_id").notNull().unique(),
  username: text("username").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  name: text("name"),
  address: text("address"),
  gender: text("gender"),
  age: integer("age"),
  favoriteTempleId: integer("favorite_temple_id"),
  mainRouteId: integer("main_route_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  templeOfficials: many(templeOfficials),
  visitHistories: many(visitHistories),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  follows: many(follows),
  userPilgrimages: many(userPilgrimages),
  userBadges: many(userBadges),
  reports: many(reports),
  favoriteTemple: one(temples, {
    fields: [users.favoriteTempleId],
    references: [temples.id],
  }),
}));
