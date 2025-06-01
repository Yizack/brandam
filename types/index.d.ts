import type { ErrorCode as _ErrorCode } from "#shared/utils/errors";
import type { MemberRole as _MemberRole } from "#shared/utils/roles";
import type { AssetStep as _AssetStep } from "~/utils/assets";

declare global {
  type ErrorCode = _ErrorCode;
  type MemberRole = _MemberRole;
  type AssetStep = _AssetStep;
}

export {};
