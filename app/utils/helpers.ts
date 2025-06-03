import mime from "mime-types";

export { useTimeAgo } from "@vueuse/core";

const documentMimeTypes = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "rtf"]);

export const getAssetType = (mimetype?: string) => {
  if (!mimetype) return "unknown";

  const extension = mime.extension(mimetype) || "";
  const checks = [
    { type: "document", match: () => documentMimeTypes.has(extension) || mimetype.startsWith("text/") },
    { type: "image", match: () => mimetype.startsWith("image/") && mimetype !== "image/svg+xml" },
    { type: "vector", match: () => ["svg", "eps", "ai"].includes(extension) },
    { type: "font", match: () => mimetype.startsWith("font/") }
  ] as const;

  return checks.find(check => check.match())?.type || "unknown";
};
