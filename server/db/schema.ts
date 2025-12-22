import { randomUUID } from "node:crypto";
import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { unixepoch } from "../utils/db";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text(),
  name: text().notNull(),
  active: integer({ mode: "boolean" }).notNull().default(true),
  confirmed: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
});

export const brands = sqliteTable("brands", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  slug: text().notNull().unique(),
  active: integer({ mode: "boolean" }).notNull().default(true),
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
}, table => [
  unique().on(table.userId, table.brandId),
  index("members_brand_id_idx").on(table.brandId),
  index("members_user_id_idx").on(table.userId)
]);

export const assets = sqliteTable("assets", {
  uuid: text().primaryKey().$default(() => randomUUID()),
  name: text().notNull(),
  description: text(),
  data: text({ mode: "json" }).$type<BrandamAsset["data"]>().notNull(),
  brandId: integer().notNull().references(() => brands.id, { onDelete: "cascade" }),
  userId: integer().references(() => users.id, { onDelete: "set null" }),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
}, table => [
  index("assets_brand_id_idx").on(table.brandId)
]);

export const domains = sqliteTable("domains", {
  id: integer().primaryKey(),
  hostname: text().notNull().unique(),
  brandId: integer().notNull().references(() => brands.id, { onDelete: "cascade" }),
  active: integer({ mode: "boolean" }).notNull().default(true),
  createdAt: integer().notNull().default(unixepoch({ mode: "ms" })),
  updatedAt: integer().notNull().default(unixepoch({ mode: "ms" }))
}, table => [
  index("domains_brand_id_idx").on(table.brandId)
]);
