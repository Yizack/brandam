export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const brand = await db.select().from(tables.brands).where(
    eq(tables.brands.slug, params.slug)
  ).get();

  if (!brand) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const assets = await db.select().from(tables.assets).where(eq(tables.assets.brandId, brand.id)).all();

  const { user } = await getUserSession(event);

  let roleId: BrandamMember["roleId"] | undefined;

  if (user) {
    const member = await db.select({
      roleId: tables.members.roleId
    }).from(tables.members).where(and(
      eq(tables.members.brandId, brand.id),
      eq(tables.members.userId, user.id),
      eq(tables.members.active, true)
    )).get();

    roleId = member?.roleId;
  }

  return {
    roleId,
    brand,
    assets
  };
});
