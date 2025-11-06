import { extension } from "mime-types";

export { useTimeAgo, useMagicKeys } from "@vueuse/core";

export const getFileExtension = (mimetype: string): string => {
  return extension(mimetype) || "";
};

export const getImageDimensions = (file: File) => {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};
