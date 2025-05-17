export default defineEventHandler(async (event) => {
  const { secure } = useRuntimeConfig(event);

  const body = await readValidatedBody(event, z.object({
    email: z.string().transform(v => v.toLocaleLowerCase().trim()),
    password: z.string().transform(v => hash(v, secure.salt)),
    remember: z.boolean()
  }).parse);

  const DB = useDB();

  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    confirmed: tables.users.confirmed
  }).from(tables.users).where(and(
    eq(tables.users.email, body.email),
    eq(tables.users.password, body.password)
  )).get();

  if (!user) {
    throw createError({
      statusCode: ErrorCode.UNAUTHORIZED,
      statusMessage: "invalid-credentials"
    });
  }

  if (!user.confirmed) {
    throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "confirmed-error" });
  }

  const maxAge = body.remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

  const session = { user };
  await setUserSession(event, session, { maxAge });
});
