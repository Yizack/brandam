export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const DB = useDB();

  const brandQuery = DB.select({
    brand: tables.brands,
    roleId: user ? tables.members.roleId : sql<BrandamMember["roleId"] | null>`NULL`
  }).from(tables.brands).where(eq(tables.brands.slug, params.slug));

  if (user) {
    brandQuery.leftJoin(tables.members, and(
      eq(tables.members.brandId, tables.brands.id),
      eq(tables.members.userId, user.id)
    ));
  }

  const brandResult = await brandQuery.get();

  if (!brandResult) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const { brand, roleId } = brandResult;
  const assets = await DB.select().from(tables.assets).where(eq(tables.assets.brandId, brand.id)).all();

  return {
    ...brand,
    assets,
    roleId: roleId ?? undefined
  };
});
