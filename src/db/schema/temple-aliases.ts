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

export const templeAliases = pgTable(
  "temple_aliases",
  {
    id: serial("id").primaryKey(),
    templeId: integer("temple_id")
      .notNull()
      .references(() => temples.id),
    aliasName: text("alias_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("temple_aliases_select_public", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("temple_aliases_insert_official", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_aliases_update_official", {
      for: "update",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
      withCheck: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_aliases_delete_official", {
      for: "delete",
      to: authenticatedRole,
      using: sql`is_temple_official(temple_id)`,
    }),
    pgPolicy("temple_aliases_admin_all", {
      for: "all",
      to: authenticatedRole,
      using: sql`is_admin()`,
      withCheck: sql`is_admin()`,
    }),
  ],
).enableRLS();

export const templeAliasesRelations = relations(templeAliases, ({ one }) => ({
  temple: one(temples, {
    fields: [templeAliases.templeId],
    references: [temples.id],
  }),
}));
