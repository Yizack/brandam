export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email"]
  },
  async onSuccess (event, { user: _user }) {
    const DB = useDB();

    const user = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      email: tables.users.email,
      active: tables.users.active,
      confirmed: tables.users.confirmed
    }).from(tables.users).where(and(
      eq(tables.users.email, _user.email)
    )).get();

    if (!user) return sendRedirect(event, "/login?error=signin_auth_error");

    if (!user.confirmed) return sendRedirect(event, "/login?error=verify_needed");

    const remember = getQuery(event).state === "remember";
    const maxAge = remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

    const session = { user };
    await setUserSession(event, session, { maxAge });

    return sendRedirect(event, "/app");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
