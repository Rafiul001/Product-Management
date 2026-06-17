export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type TROLE = (typeof ROLES)[keyof typeof ROLES];
export const roles = Object.values(ROLES);
