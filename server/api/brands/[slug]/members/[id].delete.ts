export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    id: z.coerce.number().min(1)
  }).parse);

  const brandId = await getBrandIdBySlug(event, params.slug);

  const actor = await db.select({
    roleId: tables.members.roleId
  }).from(tables.members).where(and(
    eq(tables.members.brandId, brandId),
    eq(tables.members.userId, user.id),
    eq(tables.members.active, true),
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
    eq(tables.members.brandId, brandId)
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
    eq(tables.members.brandId, brandId)
  )).run();
});
