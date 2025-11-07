export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, "host");

  if (!host) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      statusMessage: "Invalid Host"
    });
  }

  const siteHost = SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (host === siteHost || host.includes("localhost")) return;

  const slug = await getSlugFromHost(event, host);

  return sendRedirect(event, `/${slug}`, 302);
});
