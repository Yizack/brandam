export const toSlug = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const fromBase64URL = (base64url: string) => {
  if (import.meta.server) {
    return Buffer.from(base64url, "base64url").toString("utf-8");
  }

  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
};
