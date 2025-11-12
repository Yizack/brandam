import { subtle } from "node:crypto";
import { digest } from "ohash";
import type { H3Event } from "h3";

export { z } from "zod";

export const hash = (message: string, salt: string) => {
  return digest(message + salt);
};

const HMAC_SHA256 = { name: "HMAC", hash: "SHA-256" };
const encoder = new TextEncoder();

export const toBase64URL = (data: string | ArrayBuffer) => {
  return Buffer.from(data as string | Uint8Array).toString("base64url");
};

export const generateToken = async (event: H3Event, fields: (unknown)[]) => {
  const config = useRuntimeConfig(event);
  const signature = await subtle.importKey("raw", encoder.encode(config.secure.secret), HMAC_SHA256, false, ["sign"]);
  const hmac = await subtle.sign(HMAC_SHA256.name, signature, encoder.encode(fields.join()));
  return toBase64URL(hmac);
};

export const ensureCanManageMember = (
  action: "delete" | "patch",
  current: Pick<BrandamMember, "roleId">,
  target: Pick<BrandamMember, "roleId">,
  options: { newRoleId?: number, message: string }
) => {
  // only owners and admins can manage members
  const isAuthorized = current.roleId <= MemberRole.ADMIN;

  // determine which role to check against (current or new role after patch)
  const effectiveTargetRole = action === "patch" && options.newRoleId !== undefined ? options.newRoleId : target.roleId;

  // protect owners from being managed
  if (target.roleId === MemberRole.OWNER || effectiveTargetRole === MemberRole.OWNER) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: options.message
    });
  }

  // can only manage members with lower privileges (higher roleId)
  // and cannot assign privileges equal to or higher than own role
  const hasHigherPrivilege = current.roleId < target.roleId && current.roleId <= effectiveTargetRole;

  if (!isAuthorized || !hasHigherPrivilege) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: options.message
    });
  }
};
