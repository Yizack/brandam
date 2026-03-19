export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    memberId: z.coerce.number()
  }).parse);

  const update = await db.delete(tables.members).where(and(
    eq(tables.members.id, params.memberId),
    eq(tables.members.userId, user.id)
  )).run();

  if (!update.rowsAffected) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Invite not found"
    });
  }
});
