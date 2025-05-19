import { exists } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const DB = useDB();

  const brand = await DB.select({
    id: tables.brands.id,
    name: tables.brands.name,
    slug: tables.brands.slug,
    description: tables.brands.description,
    updatedAt: tables.brands.updatedAt,
    createdAt: tables.brands.createdAt,
    members: count(tables.members.id).as("members"),
    assets: count(tables.assets.id).as("assets")
  }).from(tables.members)
    .innerJoin(tables.brands, eq(tables.brands.id, tables.members.brandId))
    .leftJoin(tables.assets, eq(tables.assets.brandId, tables.brands.id))
    .where(exists(
      DB.select().from(tables.members).where(and(
        eq(tables.members.brandId, tables.brands.id), eq(tables.members.userId, user.id)
      ))
    ))
    .groupBy(tables.brands.id)
    .orderBy(desc(tables.brands.updatedAt))
    .all();

  return brand;
});
