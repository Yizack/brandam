export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const invites = await db.select({
    id: tables.members.id,
    roleId: tables.members.roleId,
    active: tables.members.active,
    updatedAt: tables.members.updatedAt,
    createdAt: tables.members.createdAt,
    brand: {
      id: tables.brands.id,
      name: tables.brands.name,
      description: tables.brands.description,
      slug: tables.brands.slug
    }
  })
    .from(tables.members).where(and(
      eq(tables.members.userId, user.id),
      not(eq(tables.members.roleId, MemberRole.OWNER))
    )).innerJoin(tables.brands, eq(tables.brands.id, tables.members.brandId)).all();

  return invites;
});
