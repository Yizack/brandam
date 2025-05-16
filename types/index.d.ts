import type { ErrorCode } from "#shared/utils/errors";
import type { MemberRole } from "#shared/utils/roles";

export {};

declare global {
  type ErrorCode = typeof ErrorCode;
  type MemberRole = typeof MemberRole;
}
