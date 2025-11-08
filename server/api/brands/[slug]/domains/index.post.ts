export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const validation = await readValidatedBody(event, z.object({
    hostname: z.hostname()
  }).safeParse);

  if (!validation.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: validation.error.issues.map(i => i.message).join(", ")
    });
  }

  const body = validation.data;

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
    eq(tables.domains.hostname, body.hostname)
  ).get();

  if (existingDomain) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "Domain already exists"
    });
  }

  const domain = await DB.insert(tables.domains).values({
    hostname: body.hostname,
    brandId: brand.id,
    active: true
  }).returning().get();

  return domain;
});
