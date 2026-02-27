import { relations, sql } from "drizzle-orm";
import { integer, pgPolicy, pgTable, serial, text } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { temples } from "./temples";

export const templeFacilities = pgTable(
  "temple_facilities",
  {
    id: serial("id").primaryKey(),
    templeId: integer("temple_id")
      .notNull()
      .unique()
      .references(() => temples.id),
    visitingHours: text("visiting_hours"),
    admissionFee: text("admission_fee"),
    parkingInfo: text("parking_info"),
    accessInfo: text("access_info"),
    prayerInfo: text("prayer_info"),
    goshuinInfo: text("goshuin_info"),
    cashlessInfo: text("cashless_info"),
    toiletInfo: text("toilet_info"),
    barrierFreeInfo: text("barrier_free_info"),
    shukuboInfo: text("shukubo_info"),
    charmsInfo: text("charms_info"),
  },
  () => [
    pgPolicy("temple_facilities_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("temple_facilities_insert_official", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_facilities_update_official", {
      for: "update",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_facilities_delete_official", {
      for: "delete",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_facilities_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const templeFacilitiesRelations = relations(
  templeFacilities,
  ({ one }) => ({
    temple: one(temples, {
      fields: [templeFacilities.templeId],
      references: [temples.id],
    }),
  }),
);
