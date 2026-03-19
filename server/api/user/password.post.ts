export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    passwordCurrent: z.string(),
    password: z.string()
  }).parse);

  if (!getPasswordStrength(body.password).isValid) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: "Password is not valid"
    });
  }

  const { secure } = useRuntimeConfig(event);

  const update = await db.update(tables.users).set({
    password: hash(body.password, secure.salt),
    updatedAt: unixepoch({ mode: "ms" })
  }).where(and(
    eq(tables.users.id, user.id),
    eq(tables.users.password, hash(body.passwordCurrent, secure.salt))
  )).run();

  if (!update.rowsAffected) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: "Current password is incorrect"
    });
  }
});
