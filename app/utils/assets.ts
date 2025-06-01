export const assetTypes = [
  { name: { singular: "Image", plural: "Images" }, value: "images", icon: "lucide:images" },
  { name: { singular: "Vector", plural: "Vectors" }, value: "vectors", icon: "lucide:pen-tool" },
  { name: { singular: "Document", plural: "Documents" }, value: "documents", icon: "lucide:file-text" },
  { name: { singular: "Font", plural: "Fonts" }, value: "fonts", icon: "lucide:type" },
  { name: { singular: "Color", plural: "Colors" }, value: "colors", icon: "lucide:palette" }
] as const;

export const enum AssetStep {
  TYPE = 0,
  DETAILS = 1,
  REVIEW = 2
}
