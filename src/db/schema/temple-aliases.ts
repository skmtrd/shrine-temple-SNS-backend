import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { temples } from "./temples";

export const templeAliases = pgTable("temple_aliases", {
  id: serial("id").primaryKey(),
  templeId: integer("temple_id")
    .notNull()
    .references(() => temples.id),
  aliasName: text("alias_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const templeAliasesRelations = relations(templeAliases, ({ one }) => ({
  temple: one(temples, {
    fields: [templeAliases.templeId],
    references: [temples.id],
  }),
}));
