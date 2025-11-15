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

export const getAssetURL = (uuid: string) => {
  return `${SITE.cdn}/uploads/assets/${uuid}`;
};

export const getPreviewURL = (uuid: string) => {
  return `${SITE.cdn}/uploads/assets/${uuid}-preview`;
};

const getFontFormat = (mimetype?: string) => {
  const formats: Record<string, string> = {
    "font/ttf": "truetype",
    "font/otf": "opentype",
    "font/woff": "woff",
    "font/woff2": "woff2"
  };
  return formats[mimetype || ""] || "truetype";
};

export const setAssetFont = (asset: BrandamAsset) => {
  const getStyle = () => {
    if (asset.data.type !== "font") return;
    return [{
      innerHTML: [
        "@font-face {",
        `font-family: '${asset.name}';`,
        `src: url('${getAssetURL(asset.uuid)}') format('${getFontFormat(asset.data.metadata?.mimetype)}');`,
        "font-weight: normal;",
        "font-style: normal;",
        "font-display: swap;",
        "}"
      ].join(""),
      tagPriority: "low" as const
    }];
  };

  const head = useHead({ style: getStyle() });

  const update = () => {
    head.patch({ style: getStyle() });
  };

  return { update };
};
