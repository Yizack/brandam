export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    uuid: z.uuidv4()
  }).parse);

  const brand = await db.select({
    id: tables.brands.id
  }).from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();

  if (!brand) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const member = await db.select().from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id)
  )).get();

  if (!member) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const asset = await db.delete(tables.assets).where(and(
    eq(tables.assets.uuid, params.uuid),
    eq(tables.assets.brandId, brand.id)
  )).returning().get();

  if (asset?.data.type !== "color") {
    event.waitUntil(
      blob.del([`uploads/assets/${params.uuid}`, `uploads/assets/${params.uuid}-preview`])
    );
  }
});
