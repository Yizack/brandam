export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    name: z.string()
  }).parse);

  await db.update(tables.users).set({
    name: body.name,
    updatedAt: unixepoch({ mode: "ms" })
  }).where(eq(tables.users.id, user.id)).run();

  const maxAge = user.remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

  const session = {
    user: {
      ...user,
      name: body.name
    }
  };

  await setUserSession(event, session, { maxAge });

  return {
    name: body.name
  };
});
