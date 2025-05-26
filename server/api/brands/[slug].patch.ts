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

  return brand;
});
