export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    uuid: z.uuidv4()
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

  const asset = await DB.delete(tables.assets).where(and(
    eq(tables.assets.uuid, params.uuid),
    eq(tables.assets.brandId, brand.id)
  )).returning().get();

  if (asset?.data.type !== "color") {
    event.waitUntil(
      hubBlob().del(`uploads/assets/${params.uuid}`)
    );
  }
});
