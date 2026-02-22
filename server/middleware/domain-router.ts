export default defineEventHandler(async (event) => {
  if (import.meta.dev) return;

  const host = getRequestHeader(event, "host");

  if (!host) {
    throw createError({
      status: ErrorCode.BAD_REQUEST,
      message: "Invalid Host"
    });
  }

  const hostname = host.split(":")[0]!;

  if (DISALLOWED_HOSTNAMES.includes(hostname)) return;

  const slug = await getSlugFromHostname(event, hostname);

  return sendRedirect(event, `/${slug}`, 302);
});
