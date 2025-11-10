export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    if (!session.user) return;

    const DB = useDB();
    const user = await DB.select({
      id: tables.users.id,
      active: tables.users.active
    }).from(tables.users).where(eq(tables.users.id, session.user.id)).get();

    if (!user?.active) {
      throw createError({
        statusCode: ErrorCode.UNAUTHORIZED,
        message: "User is inactive"
      });
    }
  });
});
