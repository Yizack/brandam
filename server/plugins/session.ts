export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    if (!session.user) return;

    const user = await db.select({
      id: tables.users.id,
      active: tables.users.active
    }).from(tables.users).where(eq(tables.users.id, session.user.id)).get();

    if (!user?.active) {
      throw createError({
        status: ErrorCode.UNAUTHORIZED,
        message: "User is inactive"
      });
    }
  });
});
