export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const DB = useDB();

  const brand = await DB.select({
    id: tables.brands.id
  }).from(tables.brands).where(and(
    eq(tables.brands.slug, params.slug),
    exists(
      DB.select().from(tables.members).where(and(
        eq(tables.members.brandId, tables.brands.id),
        eq(tables.members.userId, user.id)
      ))
    )
  )).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const domains = await DB.select().from(tables.domains).where(eq(tables.domains.brandId, brand.id)).all();

  return domains;
});
