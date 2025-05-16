declare global {
  interface BamfolioAsset {
    id: number;
    name: string;
    description: string | null;
    data: |
      {
        type: "file";
        metadata: {
          name: string;
          size: string;
          mimetype: string;
          [key: string]: string;
        };
      } | {
        type: "text" | "color";
        content: string; // hex color or text
      };
    brandId: number;
    createdAt: number;
    updatedAt: number;
  }
}

export {};
