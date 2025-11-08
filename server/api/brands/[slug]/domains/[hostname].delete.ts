export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    hostname: z.hostname()
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

  const domain = await DB.select().from(tables.domains).where(and(
    eq(tables.domains.name, params.hostname),
    eq(tables.domains.brandId, brand.id)
  )).get();

  if (!domain) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Domain not found"
    });
  }

  await DB.delete(tables.domains).where(eq(tables.domains.name, params.hostname));
});
