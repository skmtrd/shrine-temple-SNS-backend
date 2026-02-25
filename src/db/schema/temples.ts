import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { templeAliases } from "./temple-aliases";
import { templeEditRequests } from "./temple-edit-requests";
import { templeFacilities } from "./temple-facilities";
import { templeOfficials } from "./temple-officials";

export const temples = pgTable("temples", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  category: text("category"),
  religion: text("religion"),
  sect: text("sect"),
  address: text("address").notNull(),
  phone: text("phone"),
  mapUrl: text("map_url"),
  history: text("history"),
  area: text("area"),
  oldProvince: text("old_province"),
  hasCulturalProperty: boolean("has_cultural_property")
    .notNull()
    .default(false),
  blessingTags: text("blessing_tags"),
  deity: text("deity"),
  isLocked: boolean("is_locked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const templesRelations = relations(temples, ({ one, many }) => ({
  facility: one(templeFacilities, {
    fields: [temples.id],
    references: [templeFacilities.templeId],
  }),
  aliases: many(templeAliases),
  officials: many(templeOfficials),
  editRequests: many(templeEditRequests),
}));
