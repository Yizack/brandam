export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    uuid: z.uuidv4()
  }).parse);

  const body = await readValidatedBody(event, z.object({
    name: z.string().min(1).transform(v => v.trim()),
    description: z.string().optional().transform(v => v?.trim() || null)
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

  const member = await DB.select().from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id)
  )).get();

  if (!member) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const asset = await DB.update(tables.assets).set({
    name: body.name,
    description: body.description,
    updatedAt: unixepoch({ mode: "ms" })
  }).where(and(
    eq(tables.assets.uuid, params.uuid),
    eq(tables.assets.brandId, brand.id)
  )).returning().get();

  return asset;
});
