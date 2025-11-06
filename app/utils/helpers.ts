import { extension } from "mime-types";

export { useTimeAgo, useMagicKeys } from "@vueuse/core";

export const getFileExtension = (mimetype: string): string => {
  return extension(mimetype) || "";
};
