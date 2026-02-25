import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { temples } from "./temples";

export const templeNews = pgTable("temple_news", {
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
});

export const templeNewsRelations = relations(templeNews, ({ one }) => ({
  temple: one(temples, {
    fields: [templeNews.templeId],
    references: [temples.id],
  }),
}));
