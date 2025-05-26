export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const DB = useDB();

  const brands = await DB.select({
    id: tables.brands.id,
    name: tables.brands.name,
    slug: tables.brands.slug,
    description: tables.brands.description,
    updatedAt: tables.brands.updatedAt,
    createdAt: tables.brands.createdAt,
    members: count(tables.members.id).as("members"),
    assets: count(tables.assets.id).as("assets")
  }).from(tables.brands)
    .innerJoin(tables.members, eq(tables.members.brandId, tables.brands.id))
    .leftJoin(tables.assets, eq(tables.assets.brandId, tables.brands.id))
    .where(eq(tables.members.userId, user.id))
    .groupBy(tables.brands.id)
    .all();

  return brands;
});
