export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    token: z.base64url()
  }).parse);

  const DB = useDB();
  const user = await DB.select({
    id: tables.users.id,
    email: tables.users.email,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, body.email)).get();

  if (!user) {
    throw createError({
      statusCode: ErrorCode.NOT_FOUND,
      message: "User not found"
    });
  }

  if (user.confirmed) return user;

  const token = await generateToken(event, [user.id, user.updatedAt]);

  if (token !== body.token) {
    throw createError({
      statusCode: ErrorCode.UNAUTHORIZED,
      message: "Invalid or expired token"
    });
  }

  await DB.update(tables.users).set({
    confirmed: true,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).run();
});
