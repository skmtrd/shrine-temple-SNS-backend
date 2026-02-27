import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";
import { temples } from "./temples";

export const templeNews = pgTable(
  "temple_news",
  {
    id: serial("id").primaryKey(),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    url: text("url"),
    categoryTag: text("category_tag"),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("temple_news_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("temple_news_insert_official", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_news_update_official", {
      for: "update",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_news_delete_official", {
      for: "delete",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_news_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const templeNewsRelations = relations(templeNews, ({ one }) => ({
  temple: one(temples, {
    fields: [templeNews.templeId],
    references: [temples.id],
  }),
}));
