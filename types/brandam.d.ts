declare global {
  interface BrandamUser {
    id: number;
    email: string;
    password: string | null;
    name: string;
    confirmed: boolean;
    createdAt: number;
    updatedAt: number;
  }
  interface BrandamBrand {
    id: number;
    name: string;
    description: string | null;
    slug: string;
    createdAt: number;
    updatedAt: number;
  }
  interface BrandamMember {
    id: number;
    userId: number;
    brandId: number;
    roleId: MemberRole;
    createdAt: number;
    updatedAt: number;
  }
  interface BrandamAsset {
    id: number;
    name: string;
    description: string | null;
    data: |
      {
        type: "file";
        metadata: {
          size: number;
          mimetype: string;
        };
      } | {
        type: "color";
        content: string; // hex color
      } | {
        type: "font";
        content: string; // font name
        url?: string; // optional URL for the font file
        metadata?: {
          size: number;
          mimetype: string;
        };
      };
    brandId: number;
    createdAt: number;
    updatedAt: number;
  }
}

export {};
