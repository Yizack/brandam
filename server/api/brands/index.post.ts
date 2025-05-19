export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    name: z.string().transform(v => v.trim()),
    description: z.string().optional().transform(v => v?.trim() || null),
    slug: z.string().transform(v => toSlug(v))
  }).parse);

  const DB = useDB();

  const brand = await DB.insert(tables.brands).values({
    name: body.name,
    description: body.description,
    slug: body.slug
  }).onConflictDoNothing().returning().get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "brand-exists"
    });
  }

  await DB.insert(tables.members).values({
    userId: user.id,
    brandId: brand.id,
    roleId: MemberRole.OWNER
  }).run();
});
