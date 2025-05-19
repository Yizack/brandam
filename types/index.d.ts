import type { ErrorCode as _ErrorCode } from "#shared/utils/errors";
import type { MemberRole as _MemberRole } from "#shared/utils/roles";

export {};

declare global {
  type ErrorCode = _ErrorCode;
  type MemberRole = _MemberRole;
}
