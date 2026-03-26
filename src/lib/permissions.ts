export type AppRole = "USER" | "ADMIN";

export function isAdminRole(role?: string | null): role is "ADMIN" {
  return role === "ADMIN";
}

export function canAccessOpsRoute(role?: string | null) {
  return isAdminRole(role);
}
