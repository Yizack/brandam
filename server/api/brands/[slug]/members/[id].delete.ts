export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    id: z.coerce.number().min(1)
  }).parse);

  const DB = useDB();

  const brand = await DB.select({
    id: tables.brands.id
  }).from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const member = await DB.delete(tables.members).where(and(
    eq(tables.members.id, params.id),
    eq(tables.members.brandId, brand.id),
    exists(
      DB.select().from(tables.members).where(and(
        eq(tables.members.brandId, brand.id),
        eq(tables.members.userId, user.id),
        eq(tables.members.roleId, MemberRole.OWNER)
      ))
    )
  )).returning().get();

  if (!member) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }
});
