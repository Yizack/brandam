export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    id: z.coerce.number().min(1)
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

  const actor = await db.select({
    roleId: tables.members.roleId
  }).from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id),
    or(
      eq(tables.members.roleId, MemberRole.OWNER),
      eq(tables.members.roleId, MemberRole.ADMIN)
    )
  )).get();

  if (!actor) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const target = await db.select({
    roleId: tables.members.roleId
  }).from(tables.members).where(and(
    eq(tables.members.id, params.id),
    eq(tables.members.brandId, brand.id)
  )).get();

  if (!target) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Member not found"
    });
  }

  ensureCanManageMember("delete", actor, target, {
    message: "You do not have permission to delete this member"
  });

  await db.delete(tables.members).where(and(
    eq(tables.members.id, params.id),
    eq(tables.members.brandId, brand.id)
  )).run();
});
