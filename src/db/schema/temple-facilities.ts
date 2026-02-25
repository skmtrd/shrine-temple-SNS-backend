import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { temples } from "./temples";

export const templeFacilities = pgTable("temple_facilities", {
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
});

export const templeFacilitiesRelations = relations(
  templeFacilities,
  ({ one }) => ({
    temple: one(temples, {
      fields: [templeFacilities.templeId],
      references: [temples.id],
    }),
  }),
);
