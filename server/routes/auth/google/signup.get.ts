export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email", "profile"]
  },
  async onSuccess (event, { user: google }) {
    const email = google.email.toLowerCase();

    const user = await db.insert(tables.users).values({
      email,
      password: null,
      name: google.given_name
    }).onConflictDoNothing().returning().get();

    if (!user) return sendRedirect(event, "/signup?error=user_exists");

    const token = await generateToken(event, [user.id, user.updatedAt]);

    const { html, text } = await renderEmail("AccountVerify", {
      lang: "en",
      link: `${SITE.host}/verify/${toBase64URL(user.email)}/${token}`
    });

    const mailchannels = useMailChannels(event);
    await mailchannels.send({
      to: { email, name: user.name },
      subject: "Verify your email address",
      html,
      text
    });

    return sendRedirect(event, "/login");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
