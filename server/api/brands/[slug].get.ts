export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().transform(v => v.toLowerCase().trim())
  }).parse);

  const DB = useDB();
  const brand = await DB.select().from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();
  return brand;
});
