import type { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  const { secure } = useRuntimeConfig(event);

  const body = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLocaleLowerCase().trim()),
    password: z.string().transform(v => hash(v, secure.salt)),
    remember: z.boolean()
  }).parse);

  const user = await db.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    active: tables.users.active,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt,
    createdAt: tables.users.createdAt
  }).from(tables.users).where(and(
    eq(tables.users.email, body.email),
    eq(tables.users.password, body.password)
  )).get();

  if (!user) {
    throw createError({
      status: ErrorCode.UNAUTHORIZED,
      message: "Invalid email or password"
    });
  }

  if (!user.confirmed) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "Account is not verified"
    });
  }

  if (!user.active) {
    throw createError({
      status: ErrorCode.FORBIDDEN,
      message: "Account is deactivated"
    });
  }

  const maxAge = body.remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

  const session: Omit<UserSession, "id"> = {
    user: {
      ...user,
      remember: body.remember || undefined
    }
  };

  await setUserSession(event, session, { maxAge });
});
