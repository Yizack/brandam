export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
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

  const members = await DB.select({
    userId: tables.members.userId,
    roleId: tables.members.roleId
  }).from(tables.members).where(eq(tables.members.brandId, brand.id)).all();

  const userIds = members.map(m => m.userId);

  const users = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(inArray(tables.users.id, userIds)).all();

  const membersList = members.map((member) => {
    return {
      roleId: member.roleId,
      user: users.find(u => u.id === member.userId)!
    };
  }).filter(m => m.user !== undefined);

  return membersList;
});
