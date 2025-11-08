import type { H3Event } from "h3";

export const getSlugFromHost = defineCachedFunction(async (event: H3Event, host: string) => {
  const DB = useDB();
  const brand = await DB.select({
    slug: tables.brands.slug
  }).from(tables.domains).where(and(
    eq(tables.domains.name, host),
    eq(tables.domains.active, true)
  )).leftJoin(tables.brands,
    eq(tables.domains.brandId, tables.brands.id)
  ).get();

  if (!brand || !brand.slug) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Domain not found or not linked to a brand"
    });
  }

  return brand.slug;
}, {
  maxAge: 60 * 60 * 24, // 1 day
  group: "functions",
  name: "getSlugFromHost",
  swr: false,
  getKey: (event: H3Event, host: string) => host
});
