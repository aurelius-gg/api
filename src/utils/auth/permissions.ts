import type { UserSelect } from "../../db/schema/users";

export const PERMISSIONS = [
  "user:create",
  "user:fetch",
  "user:delete",
  "user:modify",
  "admin:all",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const userHasPermissions = (
  user: UserSelect,
  permission: Permission
): boolean => {
  const permissions = user.permissions as Permission[];
  if (permissions.includes(permission) || permissions.includes("admin:all"))
    return true;
  return false;
};
