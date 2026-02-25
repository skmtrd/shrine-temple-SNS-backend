import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { visitHistories } from "./visit-histories";

export const visitPhotos = pgTable("visit_photos", {
  id: serial("id").primaryKey(),
  visitHistoryId: integer("visit_history_id")
    .notNull()
    .references(() => visitHistories.id),
  imageUrl: text("image_url").notNull(),
  isGoshuinImage: boolean("is_goshuin_image").notNull().default(false),
});

export const visitPhotosRelations = relations(visitPhotos, ({ one }) => ({
  visitHistory: one(visitHistories, {
    fields: [visitPhotos.visitHistoryId],
    references: [visitHistories.id],
  }),
}));
