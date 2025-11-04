export const assetTypes = [
  { name: { singular: "Image", plural: "Images" }, value: "image", icon: "lucide:images" },
  { name: { singular: "Vector", plural: "Vectors" }, value: "vector", icon: "lucide:pen-tool" },
  { name: { singular: "Document", plural: "Documents" }, value: "document", icon: "lucide:file-text" },
  { name: { singular: "Font", plural: "Fonts" }, value: "font", icon: "lucide:type" },
  { name: { singular: "Color", plural: "Colors" }, value: "color", icon: "lucide:palette" }
] as const;

export const enum AssetStep {
  TYPE = 0,
  DETAILS = 1,
  REVIEW = 2
}

export const getAssetImage = (uuid: string) => {
  return `${SITE.cdn}/uploads/assets/${uuid}`;
};
