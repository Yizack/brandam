export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    name: z.string().transform(v => v.trim()),
    description: z.string().optional().transform(v => v?.trim() || null),
    slug: z.string().transform(v => toSlug(v))
  }).parse);

  if (DISALLOWED_BRANDS.includes(body.slug)) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: "Brand slug is not allowed"
    });
  }

  const brand = await db.insert(tables.brands).values({
    name: body.name,
    description: body.description,
    slug: body.slug
  }).onConflictDoNothing().returning().get();

  if (!brand) {
    throw createError({
      status: ErrorCode.CONFLICT,
      message: "Brand with this slug already exists"
    });
  }

  await db.insert(tables.members).values({
    userId: user.id,
    brandId: brand.id,
    roleId: MemberRole.OWNER
  }).run();

  return {
    ...brand,
    count: {
      members: 1,
      assets: 0
    }
  };
});
