declare global {
  interface BrandamUser {
    id: number;
    email: string;
    password?: string | null;
    name: string;
    active: boolean;
    confirmed: boolean;
    createdAt: number;
    updatedAt: number;
  }

  interface BrandamBrand {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
    createdAt: number;
    updatedAt: number;
  }

  interface BrandamBrandWithCount extends BrandamBrand {
    count: {
      members: number;
      assets: number;
    };
  }

  interface BrandamMemberSchema {
    id: number;
    userId: number;
    brandId: number;
    roleId: MemberRole;
    createdAt: number;
    updatedAt: number;
  }

  interface BrandamMember extends Pick<BrandamMemberSchema, "id" | "roleId"> {
    user: Omit<BrandamUser, "password" | "active" | "confirmed">;
  }

  type BrandamAssetTypes = "image" | "vector" | "document" | "font" | "color";

  interface BrandamAsset {
    uuid: string;
    name: string;
    description: string | null;
    data: |
      {
        type: BrandamAssetTypes;
        content?: string;
        hasPreview?: boolean;
        bgColor?: string;
        metadata?: {
          size: number;
          width?: number;
          height?: number;
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

  interface BrandamBrandWithAssets {
    brand: BrandamBrand;
    assets: BrandamAsset[];
  }

  interface BrandamDomain {
    id: number;
    hostname: string;
    brandId: number;
    active: boolean;
    createdAt: number;
    updatedAt: number;
  }
}

export {};
