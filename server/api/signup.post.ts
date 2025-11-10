export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    name: z.string(),
    email: z.email().transform(v => v.toLowerCase().trim()),
    password: z.string(),
    turnstile: z.string()
  }).parse);

  if (!body.turnstile) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Turnstile validation is required"
    });
  }

  const verify = await verifyTurnstileToken(body.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: ErrorCode.UNPROCESSABLE_ENTITY,
      message: "Turnstile verification failed"
    });
  }

  if (!getPasswordStrength(body.password).isValid) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "Password is not valid"
    });
  }

  const { secure } = useRuntimeConfig(event);

  const DB = useDB();

  const user = await DB.insert(tables.users).values({
    email: body.email,
    password: hash(body.password, secure.salt),
    name: body.name,
    createdAt: unixepoch({ mode: "ms" }),
    updatedAt: unixepoch({ mode: "ms" })
  }).onConflictDoNothing().returning().get();

  if (!user) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "An account with that email already exists"
    });
  }

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountVerify", {
    lang: "en",
    link: `${SITE.url}/verify/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email: user.email, name: user.name },
    subject: "Verify your email address",
    html,
    text
  });
});
