import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { visitHistories } from "./visit-histories";

export const visitPhotos = pgTable(
  "visit_photos",
  {
    id: serial("id").primaryKey(),
    visitHistoryId: integer("visit_history_id")
      .notNull()
      .references(() => visitHistories.id),
    imageUrl: text("image_url").notNull(),
    isGoshuinImage: boolean("is_goshuin_image").notNull().default(false),
  },
  () => [
    pgPolicy("visit_photos_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("visit_photos_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid()))`,
    }),
    pgPolicy("visit_photos_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid()))`,
      withCheck: sql`EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid()))`,
    }),
    pgPolicy("visit_photos_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM visit_histories WHERE id = visit_history_id AND user_id = (select auth.uid()))`,
    }),
    pgPolicy("visit_photos_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const visitPhotosRelations = relations(visitPhotos, ({ one }) => ({
  visitHistory: one(visitHistories, {
    fields: [visitPhotos.visitHistoryId],
    references: [visitHistories.id],
  }),
}));
