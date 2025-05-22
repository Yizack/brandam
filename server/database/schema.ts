import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { unixepoch } from "../utils/db";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text(),
  name: text().notNull(),
  confirmed: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const brands = sqliteTable("brands", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  slug: text().notNull().unique(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const members = sqliteTable("members", {
  id: integer().primaryKey(),
  userId: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  brandId: integer().notNull().references(() => brands.id, { onDelete: "cascade" }),
  roleId: integer().$type<BrandamMember["roleId"]>().notNull(),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const assets = sqliteTable("assets", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  data: text({ mode: "json" }).$type<BrandamAsset["data"]>().notNull(),
  brandId: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  userId: integer().references(() => users.id, { onDelete: "set null" }),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});
