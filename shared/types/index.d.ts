import type { ErrorCode as _ErrorCode } from "../utils/errors";
import type { MemberRole as _MemberRole } from "../utils/roles";
import type { AssetStep as _AssetStep } from "~/app/utils/assets";

declare global {
  type ErrorCode = _ErrorCode;
  type MemberRole = _MemberRole;
  type AssetStep = _AssetStep;
}

export {};
