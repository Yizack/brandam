export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    hostname: z.hostname()
  }).parse);

  const brandId = await getBrandIdBySlug(event, params.slug);

  const member = await db.select().from(tables.members).where(and(
    eq(tables.members.brandId, brandId),
    eq(tables.members.userId, user.id),
    or(
      eq(tables.members.roleId, MemberRole.OWNER),
      eq(tables.members.roleId, MemberRole.ADMIN)
    )
  )).get();

  if (!member) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const domain = await db.select().from(tables.domains).where(and(
    eq(tables.domains.hostname, params.hostname),
    eq(tables.domains.brandId, brandId)
  )).get();

  if (!domain) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Domain not found"
    });
  }

  await db.delete(tables.domains).where(eq(tables.domains.hostname, params.hostname));
});
