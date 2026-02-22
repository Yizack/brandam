export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const membersList = await db.select({
    id: tables.members.id,
    roleId: tables.members.roleId,
    active: tables.members.active,
    user: {
      id: tables.users.id,
      name: tables.users.name,
      email: tables.users.email,
      createdAt: tables.users.createdAt,
      updatedAt: tables.users.updatedAt
    }
  })
    .from(tables.members)
    .innerJoin(tables.users, eq(tables.members.userId, tables.users.id))
    .innerJoin(tables.brands, eq(tables.members.brandId, tables.brands.id))
    .where(eq(tables.brands.slug, params.slug))
    .all();

  if (!membersList.length) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  if (!membersList.some(m => m.user.id === user.id)) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  return membersList;
});
