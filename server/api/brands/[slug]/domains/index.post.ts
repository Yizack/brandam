export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    slug: z.string().min(1).transform(v => v.toLowerCase().trim())
  }).parse);

  const validation = await readValidatedBody(event, z.object({
    hostname: z.hostname().refine(val => !DISALLOWED_HOSTNAMES.includes(val), {
      message: "Domain not allowed"
    })
  }).safeParse);

  if (!validation.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: validation.error.issues.map(i => i.message).join(", ")
    });
  }

  const body = validation.data;

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

  const member = await DB.select().from(tables.members).where(and(
    eq(tables.members.brandId, brand.id),
    eq(tables.members.userId, user.id),
    or(
      eq(tables.members.roleId, MemberRole.OWNER),
      eq(tables.members.roleId, MemberRole.ADMIN)
    )
  )).get();

  if (!member) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "You do not have access to this brand"
    });
  }

  const domain = await DB.insert(tables.domains).values({
    hostname: body.hostname,
    brandId: brand.id,
    active: true
  }).onConflictDoNothing().returning().get();

  if (!domain) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "Domain already exists"
    });
  }

  return domain;
});
