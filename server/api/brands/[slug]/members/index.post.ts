export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const body = await readValidatedBody(event, z.object({
    email: z.email()
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

  const targetUser = await db.select({
    id: tables.users.id
  }).from(tables.users).where(eq(tables.users.email, body.email)).get();

  if (!targetUser) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "User not found"
    });
  }

  const insert = await db.insert(tables.members).values({
    userId: targetUser.id,
    brandId: brandId,
    roleId: MemberRole.EDITOR
  }).onConflictDoNothing().returning().get();

  if (!insert) {
    throw createError({
      status: ErrorCode.CONFLICT,
      message: "User is already a member of this brand"
    });
  }

  return insert;
});
