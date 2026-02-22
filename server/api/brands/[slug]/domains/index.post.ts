export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const validation = await readValidatedBody(event, z.object({
    hostname: z.hostname().refine(val => !DISALLOWED_HOSTNAMES.includes(val), {
      message: "Domain not allowed"
    })
  }).safeParse);

  if (!validation.success) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: validation.error.issues.map(i => i.message).join(", ")
    });
  }

  const body = validation.data;

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

  const domain = await db.insert(tables.domains).values({
    hostname: body.hostname,
    brandId,
    active: true
  }).onConflictDoNothing().returning().get();

  if (!domain) {
    throw createError({
      status: ErrorCode.CONFLICT,
      message: "Domain already exists"
    });
  }

  return domain;
});
