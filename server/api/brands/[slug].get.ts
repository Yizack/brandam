export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().transform(v => v.toLowerCase().trim())
  }).parse);

  const DB = useDB();

  const brand = await DB.select().from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const assets = await DB.select().from(tables.assets).where(eq(tables.assets.brandId, brand.id)).orderBy(desc(tables.assets.updatedAt)).all();

  return {
    ...brand,
    assets
  };
});
