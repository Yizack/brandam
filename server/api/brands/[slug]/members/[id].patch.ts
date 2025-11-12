export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim()),
    id: z.coerce.number().min(1)
  }).parse);

  const body = await readValidatedBody(event, z.object({
    roleId: z.number().max(Math.max(...roleKeys)).min(Math.min(...roleKeys))
  }).parse);

  const DB = useDB();

  const brand = await DB.select({
    id: tables.brands.id
  }).from(tables.brands).where(eq(tables.brands.slug, params.slug)).get();

  if (!brand) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Brand not found"
    });
  }

  const userMember = await DB.select({
    roleId: tables.members.roleId
  }).from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id),
    or(
      eq(tables.members.roleId, MemberRole.OWNER),
      eq(tables.members.roleId, MemberRole.ADMIN)
    )
  )).get();

  if (!userMember) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const targetMember = await DB.select({
    roleId: tables.members.roleId
  }).from(tables.members).where(and(
    eq(tables.members.id, params.id),
    eq(tables.members.brandId, brand.id)
  )).get();

  if (!targetMember) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "Member not found"
    });
  }

  ensureCanManageMember("patch", userMember, targetMember, {
    newRoleId: body.roleId,
    message: "You do not have permission to update this member"
  });

  const member = await DB.update(tables.members).set({
    roleId: body.roleId
  }).where(and(
    eq(tables.members.id, params.id),
    eq(tables.members.brandId, brand.id)
  )).returning().get();

  return member;
});
