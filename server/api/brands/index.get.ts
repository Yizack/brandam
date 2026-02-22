export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const members = db.select({ value: count() }).from(tables.members).where(and(eq(tables.members.brandId, tables.brands.id), eq(tables.members.active, true)));
  const assets = db.select({ value: count() }).from(tables.assets).where(eq(tables.assets.brandId, tables.brands.id));

  const brands = await db.select({
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
    .where(and(eq(tables.members.userId, user.id), eq(tables.members.active, true))).all();

  return brands;
});
