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
    uuid: string;
    name: string;
    description: string | null;
    data: |
      {
        type: "image" | "vector" | "document" | "font";
        content?: string;
        metadata?: {
          size: number;
          mimetype: string;
        } | undefined;
      } | {
        type: "color";
        content: string;
      };
    brandId: number;
    createdAt: number;
    updatedAt: number;
  }
}

export {};
