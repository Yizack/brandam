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
