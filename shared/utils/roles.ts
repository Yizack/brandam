export const enum MemberRole {
  OWNER = 1,
  ADMIN = 2,
  EDITOR = 3
}

const roleGrants = {
  owner: [MemberRole.OWNER],
  admin: [MemberRole.OWNER, MemberRole.ADMIN],
  edit: [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.EDITOR]
};

export const roleNames = {
  [MemberRole.OWNER]: "Owner",
  [MemberRole.ADMIN]: "Admin",
  [MemberRole.EDITOR]: "Editor"
} as const;

export const roleKeys: MemberRole[] = Object.keys(roleNames).map(k => Number(k));

export const getRoleGrants = (roleId?: MemberRole, conditional?: boolean): Record<keyof typeof roleGrants, boolean> => {
  const result: Record<string, boolean> = {};
  for (const key of Object.keys(roleGrants) as (keyof typeof roleGrants)[]) {
    result[key] = !!roleId && roleGrants[key].includes(roleId) && !!conditional;
  }
  return result;
};
