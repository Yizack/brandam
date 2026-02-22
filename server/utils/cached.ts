import type { H3Event } from "h3";

export const getSlugFromHostname = defineCachedFunction(async (event: H3Event, hostname: string) => {
  const brand = await db.select({
    slug: tables.brands.slug
  }).from(tables.domains).where(and(
    eq(tables.domains.hostname, hostname),
    eq(tables.domains.active, true)
  )).leftJoin(tables.brands,
    eq(tables.domains.brandId, tables.brands.id)
  ).get();

  if (!brand || !brand.slug) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Domain not found or not linked to a brand"
    });
  }

  return brand.slug;
}, {
  maxAge: 60 * 60 * 24, // 1 day
  group: "functions",
  name: "getSlugFromHostname",
  swr: false,
  getKey: (event: H3Event, hostname: string) => hostname
});

export const getBrandIdBySlug = defineCachedFunction(async (event: H3Event, slug: string) => {
  const brand = await db.select().from(tables.brands).where(
    eq(tables.brands.slug, slug)
  ).get();

  if (!brand) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  return brand.id;
}, {
  maxAge: 60 * 60 * 24, // 1 day
  group: "functions",
  name: "getBrandIdBySlug",
  swr: false,
  getKey: (event: H3Event, slug: string) => slug
});
