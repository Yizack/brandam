export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const brandId = await getBrandIdBySlug(event, params.slug);

  const member = await db.select().from(tables.members).where(and(
    eq(tables.members.brandId, brandId),
    eq(tables.members.userId, user.id),
    eq(tables.members.active, true)
  )).get();

  if (!member) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const domains = await db.select().from(tables.domains).where(eq(tables.domains.brandId, brandId)).all();

  return domains;
});
