export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim())
  }).parse);

  const DB = useDB();
  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
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

  if (user.confirmed) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "Account is already verified"
    });
  }

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountVerify", {
    lang: "en",
    link: `${SITE.host}/verify/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email: body.email, name: user.name },
    subject: "Verify your email address",
    html,
    text
  });
});
