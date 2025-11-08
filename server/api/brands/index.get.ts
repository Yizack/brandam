export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const DB = useDB();
  const members = DB.select({ value: count() }).from(tables.members).where(eq(tables.members.brandId, tables.brands.id));
  const assets = DB.select({ value: count() }).from(tables.assets).where(eq(tables.assets.brandId, tables.brands.id));

  const brands = await DB.select({
    id: tables.brands.id,
    name: tables.brands.name,
    slug: tables.brands.slug,
    description: tables.brands.description,
    active: tables.brands.active,
    updatedAt: tables.brands.updatedAt,
    createdAt: tables.brands.createdAt,
    count: {
      members: sql<number>`${members}`,
      assets: sql<number>`${assets}`
    }
  }).from(tables.brands)
    .innerJoin(tables.members, eq(tables.members.brandId, tables.brands.id))
    .where(eq(tables.members.userId, user.id)).all();

  return brands;
});
