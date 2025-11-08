import { exists } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const body = await readValidatedBody(event, z.object({
    name: z.string().transform(v => v.trim()),
    description: z.string().optional().transform(v => v?.trim() || null),
    slug: z.string().transform(v => toSlug(v))
  }).parse);

  const DB = useDB();

  try {
    const brand = await DB.update(tables.brands)
      .set({
        name: body.name,
        description: body.description,
        slug: body.slug,
        updatedAt: unixepoch({ mode: "ms" })
      }).where(and(
        eq(tables.brands.slug, params.slug),
        exists(
          DB.select({ id: tables.members.id }).from(tables.members).where(and(
            eq(tables.members.brandId, tables.brands.id),
            eq(tables.members.userId, user.id),
            or(eq(tables.members.roleId, MemberRole.OWNER), eq(tables.members.roleId, MemberRole.ADMIN))
          ))
        )
      )).returning().get();

    if (!brand) {
      throw createError({
        statusCode: ErrorCode.NOT_FOUND,
        message: "Brand not found or you don't have permission to update it"
      });
    }

    return brand;
  }
  catch (error) {
    const errorMessage = error instanceof Error ? String(error.cause) : String(error);

    if (errorMessage.includes("UNIQUE constraint failed: brands.slug") || errorMessage.includes("SQLITE_CONSTRAINT")) {
      throw createError({
        statusCode: ErrorCode.CONFLICT,
        message: "Brand with this slug already exists"
      });
    }

    throw error;
  }
});
