export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const body = await readValidatedBody(event, z.object({
    name: z.hostname()
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

  const existingDomain = await DB.select().from(tables.domains).where(
    eq(tables.domains.name, body.name)
  ).get();

  if (existingDomain) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "Domain already exists"
    });
  }

  const domain = await DB.insert(tables.domains).values({
    name: body.name,
    brandId: brand.id,
    active: true
  }).returning().get();

  return domain;
});
